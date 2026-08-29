import api from "./api";

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  status: string;
  users: number;
  permissionCount: number;
  level: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionItem {
  id: string;
  code: string;
  module: string;
  action: string;
  description: string;
}

export interface SystemUserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  birthday: string | null;
  role: string;
  roles: string[];
  roleIds: string[];
  branch: string;
  branchId: string | null;
  status: string;
  createdAt: string;
}

export const roleService = {
  async getRoles(): Promise<RoleItem[]> {
    const res = await api.get("/roles");
    return res.data.data;
  },

  async getRole(id: string): Promise<RoleItem> {
    const res = await api.get(`/roles/${id}`);
    return res.data.data;
  },

  async createRole(data: {
    name: string;
    description?: string;
    status?: string;
    permissionCodes?: string[];
  }): Promise<RoleItem> {
    const res = await api.post("/roles", data);
    return res.data.data;
  },

  async updateRole(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
      permissionCodes?: string[];
    }
  ): Promise<RoleItem> {
    const res = await api.put(`/roles/${id}`, data);
    return res.data.data;
  },

  async deleteRole(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  },

  async getPermissions(): Promise<{ all: PermissionItem[]; grouped: Record<string, PermissionItem[]> }> {
    const res = await api.get("/roles/permissions");
    return res.data.data;
  },

  async getUsers(search?: string, role?: string, branchId?: string): Promise<SystemUserItem[]> {
    const params: any = {};
    if (search) params.search = search;
    if (role) params.role = role;
    if (branchId) params.branchId = branchId;
    const res = await api.get("/users", { params });
    return res.data.data;
  },

  async createUser(data: {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    branchId?: string | null;
    status?: string;
    roleIds?: string[];
  }): Promise<any> {
    const res = await api.post("/users", data);
    return res.data.data;
  },

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      branchId?: string | null;
      status?: string;
      roleIds?: string[];
      password?: string;
    }
  ): Promise<any> {
    const res = await api.put(`/users/${id}`, data);
    return res.data.data;
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default roleService;
