/*
 * This class is defined in rn-bridge/index.js as well.
 * Any change made here should be ported to rn-bridge/index.js too.
 * The MessageCodec class provides two static methods to serialize/deserialize
 * the data sent through the events channel.
 */

/**
 * Represents a deserialized message envelope with parsed payload
 */
export interface DeserializedMessage<T = unknown[]> {
  /** The event name/type */
  event: string;
  /** The parsed payload array */
  payload: T;
}

/**
 * Error thrown when message serialization/deserialization fails
 */
export class MessageCodecError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "MessageCodecError";
  }
}

/**
 * Serializes an event and payload into a JSON string for transmission
 * @param event - The event name
 * @param payload - The payload items to serialize
 * @returns JSON string representation of the message envelope
 * @throws MessageCodecError if serialization fails
 */
export function serialize(event: string, ...payload: unknown[]): string {
  if (typeof event !== "string" || event.length === 0) {
    throw new MessageCodecError("Event name must be a non-empty string");
  }

  try {
    const message: DeserializedMessage = { event, payload };
    return JSON.stringify(message);
  } catch (error) {
    throw new MessageCodecError(
      `Failed to serialize message for event "${event}"`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Deserializes a JSON string back into an event and payload
 * @param message - The JSON string to deserialize
 * @returns Deserialized message with event and payload
 * @throws MessageCodecError if deserialization fails
 */
export function deserialize<T extends unknown[] = unknown[]>(
  message: string
): DeserializedMessage<T> {
  if (typeof message !== "string") {
    throw new MessageCodecError("Message must be a string");
  }

  try {
    const deserializedMessage: unknown = JSON.parse(message);

    if (!deserializedMessage || typeof deserializedMessage !== "object") {
      throw new MessageCodecError("Invalid message format: expected object");
    }
    if (
      !("event" in deserializedMessage) ||
      !("payload" in deserializedMessage)
    ) {
      throw new MessageCodecError(
        "Invalid message format: must contain 'event' and 'payload' properties"
      );
    }
    const { event, payload } = deserializedMessage;

    if (typeof event !== "string") {
      throw new MessageCodecError(
        "Invalid message format: event must be a string"
      );
    }

    if (!Array.isArray(payload)) {
      throw new MessageCodecError(
        "Invalid message format: payload must be an array"
      );
    }

    return {
      event,
      payload: payload as T,
    };
  } catch (error) {
    if (error instanceof MessageCodecError) {
      throw error;
    }
    throw new MessageCodecError(
      "Failed to deserialize message",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}
