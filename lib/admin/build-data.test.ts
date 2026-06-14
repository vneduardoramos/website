import { describe, it, expect } from "vitest";
import { buildEntityData, m2mConnections } from "@/lib/admin/build-data";
import type { AdminModel } from "@/lib/admin/config";

function model(fields: AdminModel["fields"], extra: Partial<AdminModel> = {}): AdminModel {
  return {
    key: "test",
    label: "Test",
    plural: "Tests",
    hasStatus: false,
    listFields: [],
    fields,
    ...extra,
  };
}

describe("buildEntityData: image", () => {
  it("empty string → null", () => {
    const m = model([{ name: "cover", label: "Cover", type: "image" }]);
    const f = new FormData();
    f.append("cover", "");
    expect(buildEntityData(m, f, true).cover).toBeNull();
  });
  it("non-empty → the URL string", () => {
    const m = model([{ name: "cover", label: "Cover", type: "image" }]);
    const f = new FormData();
    f.append("cover", "/uploads/x.png");
    expect(buildEntityData(m, f, true).cover).toBe("/uploads/x.png");
  });
});

describe("buildEntityData: relation single", () => {
  const m = model([
    {
      name: "authorTeamId",
      label: "Author",
      type: "relation",
      relation: { model: "teamMember", labelField: "name" },
    },
  ]);
  it('"" → null', () => {
    const f = new FormData();
    f.append("authorTeamId", "");
    expect(buildEntityData(m, f, true).authorTeamId).toBeNull();
  });
  it("an id → that id on the scalar field, and not in m2mConnections", () => {
    const f = new FormData();
    f.append("authorTeamId", "tm_123");
    expect(buildEntityData(m, f, true).authorTeamId).toBe("tm_123");
    expect(m2mConnections(m, f, true)).toEqual({});
    expect(m2mConnections(m, f, false)).toEqual({});
  });
});

describe("buildEntityData: relation multiple", () => {
  const m = model([
    {
      name: "tags",
      label: "Tags",
      type: "relation",
      relation: { model: "tag", labelField: "name", multiple: true },
    },
  ]);
  it("is not a scalar in buildEntityData output", () => {
    const f = new FormData();
    f.append("tags", "t1");
    f.append("tags", "t2");
    expect("tags" in buildEntityData(m, f, true)).toBe(false);
  });
  it("m2mConnections on create uses connect (set is invalid on Prisma create), filtering empties", () => {
    const f = new FormData();
    f.append("tags", "t1");
    f.append("tags", "");
    f.append("tags", "t2");
    expect(m2mConnections(m, f, true)).toEqual({
      tags: { connect: [{ id: "t1" }, { id: "t2" }] },
    });
  });
  it("m2mConnections on update uses set (replaces the full relation), filtering empties", () => {
    const f = new FormData();
    f.append("tags", "t1");
    f.append("tags", "");
    f.append("tags", "t2");
    expect(m2mConnections(m, f, false)).toEqual({
      tags: { set: [{ id: "t1" }, { id: "t2" }] },
    });
  });
  it("m2mConnections on update with no selection clears the relation (set: [])", () => {
    // A native <select multiple> with nothing selected submits no entry for the field.
    const f = new FormData();
    expect(m2mConnections(m, f, false)).toEqual({ tags: { set: [] } });
  });
});

describe("buildEntityData: repeater", () => {
  const m = model([
    {
      name: "items",
      label: "Items",
      type: "repeater",
      itemFields: [{ name: "title", label: "Title", type: "text" }],
    },
  ]);
  it('"[]" → null', () => {
    const f = new FormData();
    f.append("items", "[]");
    expect(buildEntityData(m, f, true).items).toBeNull();
  });
  it("valid array JSON → stored verbatim", () => {
    const f = new FormData();
    const json = '[{"title":"a"}]';
    f.append("items", json);
    expect(buildEntityData(m, f, true).items).toBe(json);
  });
  it("invalid JSON → throws", () => {
    const f = new FormData();
    f.append("items", "{not json");
    expect(() => buildEntityData(m, f, true)).toThrow(/must be valid JSON/);
  });
});

describe("buildEntityData: group", () => {
  const m = model([
    {
      name: "cta",
      label: "CTA",
      type: "group",
      itemFields: [{ name: "label", label: "Label", type: "text" }],
    },
  ]);
  it('"{}" → null', () => {
    const f = new FormData();
    f.append("cta", "{}");
    expect(buildEntityData(m, f, true).cta).toBeNull();
  });
  it('"" → null', () => {
    const f = new FormData();
    f.append("cta", "");
    expect(buildEntityData(m, f, true).cta).toBeNull();
  });
  it("valid object JSON → stored verbatim", () => {
    const f = new FormData();
    const json = '{"label":"Go"}';
    f.append("cta", json);
    expect(buildEntityData(m, f, true).cta).toBe(json);
  });
});

describe("buildEntityData: auto-slug", () => {
  it("blank slug becomes slugify(title)", () => {
    const m = model([
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
    ]);
    const f = new FormData();
    f.append("title", "Hello World");
    f.append("slug", "");
    expect(buildEntityData(m, f, true).slug).toBe("hello-world");
  });
});

describe("buildEntityData: publish workflow", () => {
  const m = model([{ name: "status", label: "Status", type: "select" }], { hasStatus: true });
  it("create with status PUBLISHED → publishedAt is a Date, status PUBLISHED", () => {
    const f = new FormData();
    f.append("status", "PUBLISHED");
    const data = buildEntityData(m, f, true);
    expect(data.status).toBe("PUBLISHED");
    expect(data.publishedAt).toBeInstanceOf(Date);
  });
  it("create with no status → status DRAFT, no publishedAt", () => {
    const f = new FormData();
    f.append("status", "");
    const data = buildEntityData(m, f, true);
    expect(data.status).toBe("DRAFT");
    expect(data.publishedAt).toBeUndefined();
  });
});
