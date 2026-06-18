import { describe, it, expect } from "vitest";
import { detectClientTool, isNativePassthrough } from "../../open-sse/utils/clientDetector.js";

describe("detectClientTool", () => {
  it("should detect hermes agent from user-agent header", () => {
    const headers = { "user-agent": "HermesAgent/1.0" };
    expect(detectClientTool(headers, {})).toBe("hermes");
  });

  it("should detect hermes agent from lowercase/alternative user-agent header", () => {
    const headers = { "user-agent": "hermes-agent/1.0" };
    expect(detectClientTool(headers, {})).toBe("hermes");
  });

  it("should enable native passthrough for hermes on openai provider", () => {
    const clientTool = "hermes";
    expect(isNativePassthrough(clientTool, "openai")).toBe(true);
    expect(isNativePassthrough(clientTool, "claude")).toBe(false);
  });
});
