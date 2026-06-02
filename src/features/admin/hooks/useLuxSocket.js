import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "../../../services/api";

function normalizeAulaIds(aulaIds = []) {
  return Array.from(
    new Set(
      aulaIds
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  ).sort((a, b) => a - b);
}

function toTopicAulaId(aulaId) {
  return typeof aulaId === "string" && aulaId.startsWith("aula-")
    ? aulaId
    : `aula-${aulaId}`;
}

function subscribeToLuxTopic(client, aulaId, onLuxRef) {
  const destination = `/topic/aulas/${toTopicAulaId(aulaId)}/lux`;

  return client.subscribe(destination, (message) => {
    const parsed = parseLuxMessage(message.body);
    if (!parsed) {
      return;
    }

    if (typeof onLuxRef.current === "function") {
      onLuxRef.current({
        aulaId,
        value: parsed.value,
        timestamp: parsed.timestamp,
        raw: parsed.raw,
      });
    }
  });
}

function parseLuxMessage(body) {
  try {
    const payload = JSON.parse(body);
    const value = Number(payload?.valorLux ?? payload?.luxValue ?? payload?.value);
    const timestamp = Number(payload?.timestamp);

    if (!Number.isFinite(value)) {
      return null;
    }

    return {
      value,
      timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
      raw: payload,
    };
  } catch {
    return null;
  }
}

export default function useLuxSocket({ aulaIds = [], enabled = true, onLux }) {
  const onLuxRef = useRef(onLux);
  const idsKey = normalizeAulaIds(aulaIds).join(",");

  useEffect(() => {
    onLuxRef.current = onLux;
  }, [onLux]);

  useEffect(() => {
    if (!enabled || !idsKey) {
      return undefined;
    }

    const ids = idsKey.split(",").map(Number);
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    const subscriptions = [];

    client.onConnect = () => {
      ids.forEach((aulaId) => {
        subscriptions.push(subscribeToLuxTopic(client, aulaId, onLuxRef));
      });
    };

    client.onStompError = (frame) => {
      console.error("Error STOMP en lux socket:", frame.headers?.message || frame.body || frame);
    };

    client.activate();

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      client.deactivate();
    };
  }, [enabled, idsKey]);
}