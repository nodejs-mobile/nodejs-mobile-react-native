/**
 * Tests for the modernized MessageCodec functions
 */

import { serialize, deserialize, MessageCodecError } from "../MessageCodec";

describe("MessageCodec", () => {
  describe("serialize", () => {
    it("should serialize simple messages correctly", () => {
      const result = serialize("test-event", "hello", 123, true);
      const parsed = JSON.parse(result);

      expect(parsed.event).toBe("test-event");
      expect(parsed.payload).toEqual(["hello", 123, true]);
    });

    it("should serialize messages without payload", () => {
      const result = serialize("empty-event");
      const parsed = JSON.parse(result);

      expect(parsed.event).toBe("empty-event");
      expect(parsed.payload).toEqual([]);
    });

    it("should serialize complex objects", () => {
      const complexPayload = {
        nested: { value: 42 },
        array: [1, 2, 3],
        nullValue: null,
      };

      const result = serialize("complex-event", complexPayload);
      const parsed = JSON.parse(result);

      expect(parsed.event).toBe("complex-event");
      expect(parsed.payload).toEqual([complexPayload]);
    });

    it("should throw error for empty event name", () => {
      expect(() => serialize("")).toThrow(MessageCodecError);
      expect(() => serialize("")).toThrow(
        "Event name must be a non-empty string"
      );
    });

    it("should throw error for non-string event name", () => {
      expect(() => serialize(123 as any)).toThrow(MessageCodecError);
    });

    it("should handle circular references gracefully", () => {
      const circular = { name: "test" };
      // @ts-expect-error
      circular.self = circular;

      expect(() => serialize("circular", circular)).toThrow(MessageCodecError);
    });
  });

  describe("deserialize", () => {
    it("should deserialize messages correctly", () => {
      const serialized = serialize("test-event", "hello", 123, true);
      const deserialized = deserialize(serialized);

      expect(deserialized.event).toBe("test-event");
      expect(deserialized.payload).toEqual(["hello", 123, true]);
    });

    it("should deserialize messages without payload", () => {
      const serialized = serialize("empty-event");
      const deserialized = deserialize(serialized);

      expect(deserialized.event).toBe("empty-event");
      expect(deserialized.payload).toEqual([]);
    });

    it("should handle messages with missing payload", () => {
      const manualMessage = JSON.stringify({ event: "test" });
      expect(() => deserialize(manualMessage)).toThrow(MessageCodecError);
      expect(() => deserialize(manualMessage)).toThrow(
        "must contain 'event' and 'payload' properties"
      );
    });

    it("should throw error for invalid JSON", () => {
      expect(() => deserialize("invalid json")).toThrow(MessageCodecError);
    });

    it("should throw error for non-string message", () => {
      expect(() => deserialize(123 as any)).toThrow(MessageCodecError);
      expect(() => deserialize(123 as any)).toThrow("Message must be a string");
    });

    it("should throw error for invalid message format", () => {
      expect(() => deserialize("null")).toThrow(MessageCodecError);
      expect(() => deserialize('"just a string"')).toThrow(MessageCodecError);
    });

    it("should throw error for missing event", () => {
      const invalidMessage = JSON.stringify({ payload: [] });
      expect(() => deserialize(invalidMessage)).toThrow(MessageCodecError);
      expect(() => deserialize(invalidMessage)).toThrow(
        "must contain 'event' and 'payload' properties"
      );
    });

    it("should throw error for non-string event", () => {
      const invalidMessage = JSON.stringify({ event: 123, payload: [] });
      expect(() => deserialize(invalidMessage)).toThrow(MessageCodecError);
      expect(() => deserialize(invalidMessage)).toThrow(
        "event must be a string"
      );
    });

    it("should throw error for non-array payload", () => {
      const invalidMessage = JSON.stringify({ event: "test", payload: 123 });
      expect(() => deserialize(invalidMessage)).toThrow(MessageCodecError);
      expect(() => deserialize(invalidMessage)).toThrow(
        "payload must be an array"
      );
    });

    it("should throw error for string payload (expecting array)", () => {
      const invalidMessage = JSON.stringify({
        event: "test",
        payload: "string",
      });
      expect(() => deserialize(invalidMessage)).toThrow(MessageCodecError);
      expect(() => deserialize(invalidMessage)).toThrow(
        "payload must be an array"
      );
    });
  });

  describe("round-trip consistency", () => {
    it("should maintain data integrity through serialize/deserialize cycles", () => {
      const testCases: [string, ...any[]][] = [
        ["simple", "hello", "world"],
        ["numbers", 1, 2.5, -3, 0],
        ["booleans", true, false],
        ["mixed", "text", 42, true, null],
        ["objects", { key: "value" }, { nested: { deep: "value" } }],
        ["arrays", [1, 2, 3], ["a", "b", "c"]],
        ["empty"],
      ];

      testCases.forEach((testCase) => {
        const event = testCase[0];
        const payload = testCase.slice(1);
        const serialized = serialize(event, ...payload);
        const deserialized = deserialize(serialized);

        expect(deserialized.event).toBe(event);
        expect(deserialized.payload).toEqual(payload);
      });
    });
  });

  describe("MessageCodecError", () => {
    it("should create error with message only", () => {
      const error = new MessageCodecError("Test error");

      expect(error.name).toBe("MessageCodecError");
      expect(error.message).toBe("Test error");
      expect(error.originalError).toBeUndefined();
    });

    it("should create error with original error", () => {
      const originalError = new Error("Original");
      const error = new MessageCodecError("Wrapper error", originalError);

      expect(error.name).toBe("MessageCodecError");
      expect(error.message).toBe("Wrapper error");
      expect(error.originalError).toBe(originalError);
    });

    it("should be instanceof Error", () => {
      const error = new MessageCodecError("Test");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof MessageCodecError).toBe(true);
    });
  });
});
