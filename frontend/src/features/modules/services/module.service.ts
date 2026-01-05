import { environment } from '../../../shared/environments/environment';
import type { Module } from '../../../shared/types/index';

class ModuleService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllModules(): Promise<Module[]> {
    const response = await fetch(`${environment.apiUrl}/modules`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch modules');
    }

    return response.json();
  }

  async getModuleById(id: string): Promise<Module> {
    const response = await fetch(`${environment.apiUrl}/modules/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch module');
    }

    return response.json();
  }

  async searchModules(query: string): Promise<Module[]> {
    const response = await fetch(`${environment.apiUrl}/modules/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search modules');
    }

    return response.json();
  }
}

export const moduleService = new ModuleService();
export default moduleService;

