import api from "./api";

export interface Setting {
  key: string;
  value: string;
  type: string;
  group: string;
  description: string | null;
  isPublic: boolean;
}

export interface SettingInput {
  key: string;
  value: string;
}

export const settingsService = {
  async getAllSettings(): Promise<Setting[]> {
    const res = await api.get("/settings");
    return res.data.data;
  },

  async getPublicSettings(): Promise<Setting[]> {
    const res = await api.get("/settings/public");
    return res.data.data;
  },

  async bulkUpdateSettings(settings: SettingInput[]): Promise<Setting[]> {
    const res = await api.put("/settings", { settings });
    return res.data.data;
  },

  async createSetting(data: Omit<Setting, "description"> & { description?: string }): Promise<Setting> {
    const res = await api.post("/settings", data);
    return res.data.data;
  },

  async deleteSetting(key: string): Promise<void> {
    await api.delete(`/settings/${key}`);
  },
};

export default settingsService;
