import { Utils } from "@bitwarden/common/misc/utils";

describe("Utils Service", () => {
  describe("getDomain", () => {
    it("should fail for invalid urls", () => {
      expect(Utils.getDomain(null)).toBeNull();
      expect(Utils.getDomain(undefined)).toBeNull();
      expect(Utils.getDomain(" ")).toBeNull();
      expect(Utils.getDomain('https://bit!:"_&ward.com')).toBeNull();
      expect(Utils.getDomain("bravurasafe")).toBeNull();
    });

    it("should fail for data urls", () => {
      expect(Utils.getDomain("data:image/jpeg;base64,AAA")).toBeNull();
    });

    it("should fail for about urls", () => {
      expect(Utils.getDomain("about")).toBeNull();
      expect(Utils.getDomain("about:")).toBeNull();
      expect(Utils.getDomain("about:blank")).toBeNull();
    });

    it("should fail for file url", () => {
      expect(Utils.getDomain("file:///C://somefolder/form.pdf")).toBeNull();
    });

    it("should handle urls without protocol", () => {
      expect(Utils.getDomain("bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("wrong://bravurasafe.com")).toBe("bravurasafe.com");
    });

    it("should handle valid urls", () => {
      expect(Utils.getDomain("bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("http://bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("https://bravurasafe.com")).toBe("bravurasafe.com");

      expect(Utils.getDomain("www.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("http://www.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("https://www.bravurasafe.com")).toBe("bravurasafe.com");

      expect(Utils.getDomain("vault.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("http://vault.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("https://vault.bravurasafe.com")).toBe("bravurasafe.com");

      expect(Utils.getDomain("www.vault.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("http://www.vault.bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getDomain("https://www.vault.bravurasafe.com")).toBe("bravurasafe.com");

      expect(
        Utils.getDomain("user:password@bravurasafe.com:8080/password/sites?and&query#hash")
      ).toBe("bravurasafe.com");
      expect(
        Utils.getDomain("http://user:password@bravurasafe.com:8080/password/sites?and&query#hash")
      ).toBe("bravurasafe.com");
      expect(
        Utils.getDomain("https://user:password@bravurasafe.com:8080/password/sites?and&query#hash")
      ).toBe("bravurasafe.com");

      expect(Utils.getDomain("bravurasafe.unknown")).toBe("bravurasafe.unknown");
      expect(Utils.getDomain("http://bravurasafe.unknown")).toBe("bravurasafe.unknown");
      expect(Utils.getDomain("https://bravurasafe.unknown")).toBe("bravurasafe.unknown");
    });

    it("should handle valid urls with an underscore in subdomain", () => {
      expect(Utils.getDomain("my_vault.bravurasafe.com/")).toBe("bravurasafe.com");
      expect(Utils.getDomain("http://my_vault.bravurasafe.com/")).toBe("bravurasafe.com");
      expect(Utils.getDomain("https://my_vault.bravurasafe.com/")).toBe("bravurasafe.com");
    });

    it("should support urls containing umlauts", () => {
      expect(Utils.getDomain("b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getDomain("http://b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getDomain("https://b??twarden.com")).toBe("b??twarden.com");

      expect(Utils.getDomain("subdomain.b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getDomain("http://subdomain.b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getDomain("https://subdomain.b??twarden.com")).toBe("b??twarden.com");
    });

    it("should support punycode urls", () => {
      expect(Utils.getDomain("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getDomain("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getDomain("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");

      expect(Utils.getDomain("subdomain.xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getDomain("http://subdomain.xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getDomain("https://subdomain.xn--btwarden-65a.com")).toBe(
        "xn--btwarden-65a.com"
      );
    });

    it("should support localhost", () => {
      expect(Utils.getDomain("localhost")).toBe("localhost");
      expect(Utils.getDomain("http://localhost")).toBe("localhost");
      expect(Utils.getDomain("https://localhost")).toBe("localhost");
    });

    it("should support localhost with subdomain", () => {
      expect(Utils.getDomain("subdomain.localhost")).toBe("localhost");
      expect(Utils.getDomain("http://subdomain.localhost")).toBe("localhost");
      expect(Utils.getDomain("https://subdomain.localhost")).toBe("localhost");
    });

    it("should support IPv4", () => {
      expect(Utils.getDomain("192.168.1.1")).toBe("192.168.1.1");
      expect(Utils.getDomain("http://192.168.1.1")).toBe("192.168.1.1");
      expect(Utils.getDomain("https://192.168.1.1")).toBe("192.168.1.1");
    });

    it("should support IPv6", () => {
      expect(Utils.getDomain("[2620:fe::fe]")).toBe("2620:fe::fe");
      expect(Utils.getDomain("http://[2620:fe::fe]")).toBe("2620:fe::fe");
      expect(Utils.getDomain("https://[2620:fe::fe]")).toBe("2620:fe::fe");
    });

    it("should reject invalid hostnames", () => {
      expect(Utils.getDomain("https://mywebsite.com$.mywebsite.com")).toBeNull();
      expect(Utils.getDomain("https://mywebsite.com!.mywebsite.com")).toBeNull();
    });
  });

  describe("getHostname", () => {
    it("should fail for invalid urls", () => {
      expect(Utils.getHostname(null)).toBeNull();
      expect(Utils.getHostname(undefined)).toBeNull();
      expect(Utils.getHostname(" ")).toBeNull();
      expect(Utils.getHostname('https://bit!:"_&ward.com')).toBeNull();
    });

    it("should fail for data urls", () => {
      expect(Utils.getHostname("data:image/jpeg;base64,AAA")).toBeNull();
    });

    it("should fail for about urls", () => {
      expect(Utils.getHostname("about")).toBe("about");
      expect(Utils.getHostname("about:")).toBeNull();
      expect(Utils.getHostname("about:blank")).toBeNull();
    });

    it("should fail for file url", () => {
      expect(Utils.getHostname("file:///C:/somefolder/form.pdf")).toBeNull();
    });

    it("should handle valid urls", () => {
      expect(Utils.getHostname("bravurasafe")).toBe("bravurasafe");
      expect(Utils.getHostname("http://bravurasafe")).toBe("bravurasafe");
      expect(Utils.getHostname("https://bravurasafe")).toBe("bravurasafe");

      expect(Utils.getHostname("bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getHostname("http://bravurasafe.com")).toBe("bravurasafe.com");
      expect(Utils.getHostname("https://bravurasafe.com")).toBe("bravurasafe.com");

      expect(Utils.getHostname("www.bravurasafe.com")).toBe("www.bravurasafe.com");
      expect(Utils.getHostname("http://www.bravurasafe.com")).toBe("www.bravurasafe.com");
      expect(Utils.getHostname("https://www.bravurasafe.com")).toBe("www.bravurasafe.com");

      expect(Utils.getHostname("vault.bravurasafe.com")).toBe("vault.bravurasafe.com");
      expect(Utils.getHostname("http://vault.bravurasafe.com")).toBe("vault.bravurasafe.com");
      expect(Utils.getHostname("https://vault.bravurasafe.com")).toBe("vault.bravurasafe.com");

      expect(Utils.getHostname("www.vault.bravurasafe.com")).toBe("www.vault.bravurasafe.com");
      expect(Utils.getHostname("http://www.vault.bravurasafe.com")).toBe("www.vault.bravurasafe.com");
      expect(Utils.getHostname("https://www.vault.bravurasafe.com")).toBe("www.vault.bravurasafe.com");

      expect(
        Utils.getHostname("user:password@bravurasafe.com:8080/password/sites?and&query#hash")
      ).toBe("bravurasafe.com");
      expect(
        Utils.getHostname("https://user:password@bravurasafe.com:8080/password/sites?and&query#hash")
      ).toBe("bravurasafe.com");
      expect(Utils.getHostname("https://bravurasafe.unknown")).toBe("bravurasafe.unknown");
    });

    it("should handle valid urls with an underscore in subdomain", () => {
      expect(Utils.getHostname("my_vault.bravurasafe.com/")).toBe("my_vault.bravurasafe.com");
      expect(Utils.getHostname("http://my_vault.bravurasafe.com/")).toBe("my_vault.bravurasafe.com");
      expect(Utils.getHostname("https://my_vault.bravurasafe.com/")).toBe("my_vault.bravurasafe.com");
    });

    it("should support urls containing umlauts", () => {
      expect(Utils.getHostname("b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getHostname("http://b??twarden.com")).toBe("b??twarden.com");
      expect(Utils.getHostname("https://b??twarden.com")).toBe("b??twarden.com");

      expect(Utils.getHostname("subdomain.b??twarden.com")).toBe("subdomain.b??twarden.com");
      expect(Utils.getHostname("http://subdomain.b??twarden.com")).toBe("subdomain.b??twarden.com");
      expect(Utils.getHostname("https://subdomain.b??twarden.com")).toBe("subdomain.b??twarden.com");
    });

    it("should support punycode urls", () => {
      expect(Utils.getHostname("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getHostname("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");
      expect(Utils.getHostname("xn--btwarden-65a.com")).toBe("xn--btwarden-65a.com");

      expect(Utils.getHostname("subdomain.xn--btwarden-65a.com")).toBe(
        "subdomain.xn--btwarden-65a.com"
      );
      expect(Utils.getHostname("http://subdomain.xn--btwarden-65a.com")).toBe(
        "subdomain.xn--btwarden-65a.com"
      );
      expect(Utils.getHostname("https://subdomain.xn--btwarden-65a.com")).toBe(
        "subdomain.xn--btwarden-65a.com"
      );
    });

    it("should support localhost", () => {
      expect(Utils.getHostname("localhost")).toBe("localhost");
      expect(Utils.getHostname("http://localhost")).toBe("localhost");
      expect(Utils.getHostname("https://localhost")).toBe("localhost");
    });

    it("should support localhost with subdomain", () => {
      expect(Utils.getHostname("subdomain.localhost")).toBe("subdomain.localhost");
      expect(Utils.getHostname("http://subdomain.localhost")).toBe("subdomain.localhost");
      expect(Utils.getHostname("https://subdomain.localhost")).toBe("subdomain.localhost");
    });

    it("should support IPv4", () => {
      expect(Utils.getHostname("192.168.1.1")).toBe("192.168.1.1");
      expect(Utils.getHostname("http://192.168.1.1")).toBe("192.168.1.1");
      expect(Utils.getHostname("https://192.168.1.1")).toBe("192.168.1.1");
    });

    it("should support IPv6", () => {
      expect(Utils.getHostname("[2620:fe::fe]")).toBe("2620:fe::fe");
      expect(Utils.getHostname("http://[2620:fe::fe]")).toBe("2620:fe::fe");
      expect(Utils.getHostname("https://[2620:fe::fe]")).toBe("2620:fe::fe");
    });
  });

  describe("newGuid", () => {
    it("should create a valid guid", () => {
      const validGuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(Utils.newGuid()).toMatch(validGuid);
    });
  });

  describe("fromByteStringToArray", () => {
    it("should handle null", () => {
      expect(Utils.fromByteStringToArray(null)).toEqual(null);
    });
  });

  describe("mapToRecord", () => {
    it("should handle null", () => {
      expect(Utils.mapToRecord(null)).toEqual(null);
    });

    it("should handle empty map", () => {
      expect(Utils.mapToRecord(new Map())).toEqual({});
    });

    it("should handle convert a Map to a Record", () => {
      const map = new Map([
        ["key1", "value1"],
        ["key2", "value2"],
      ]);
      expect(Utils.mapToRecord(map)).toEqual({ key1: "value1", key2: "value2" });
    });

    it("should handle convert a Map to a Record with non-string keys", () => {
      const map = new Map([
        [1, "value1"],
        [2, "value2"],
      ]);
      const result = Utils.mapToRecord(map);
      expect(result).toEqual({ 1: "value1", 2: "value2" });
      expect(Utils.recordToMap(result)).toEqual(map);
    });

    it("should not convert an object if it's not a map", () => {
      const obj = { key1: "value1", key2: "value2" };
      expect(Utils.mapToRecord(obj as any)).toEqual(obj);
    });
  });

  describe("recordToMap", () => {
    it("should handle null", () => {
      expect(Utils.recordToMap(null)).toEqual(null);
    });

    it("should handle empty record", () => {
      expect(Utils.recordToMap({})).toEqual(new Map());
    });

    it("should handle convert a Record to a Map", () => {
      const record = { key1: "value1", key2: "value2" };
      expect(Utils.recordToMap(record)).toEqual(new Map(Object.entries(record)));
    });

    it("should handle convert a Record to a Map with non-string keys", () => {
      const record = { 1: "value1", 2: "value2" };
      const result = Utils.recordToMap(record);
      expect(result).toEqual(
        new Map([
          [1, "value1"],
          [2, "value2"],
        ])
      );
      expect(Utils.mapToRecord(result)).toEqual(record);
    });

    it("should not convert an object if already a map", () => {
      const map = new Map([
        ["key1", "value1"],
        ["key2", "value2"],
      ]);
      expect(Utils.recordToMap(map as any)).toEqual(map);
    });
  });
});
