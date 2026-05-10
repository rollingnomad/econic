import { db } from "./db";

// Delete Site
export async function deleteSite(siteId) {
  await db.transaction(
    "rw",
    db.sites,
    db.communities,
    db.observations,
    async () => {
      const communities = await db.communities
        .where("siteId")
        .equals(siteId)
        .toArray();

      const communityIds = communities.map((c) => c.id);

      // delete observations first
      await db.observations.where("communityId").anyOf(communityIds).delete();

      // delete communities
      await db.communities.where("siteId").equals(siteId).delete();

      // delete site
      await db.sites.delete(siteId);
    },
  );
}

// Delete Community
export async function deleteCommunity(communityId) {
  await db.transaction("rw", db.communities, db.observations, async () => {
    await db.observations.where("communityId").equals(communityId).delete();

    await db.communities.delete(communityId);
  });
}
