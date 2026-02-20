const db = new Dexie("PortfolioDB");
db.version(1).stores({
    settings: "id, theme, lastVisit",
    drafts: "++id, name, email, message, timestamp"
});
