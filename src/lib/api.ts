import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-d8ebeed1`;

export const api = {
  // Payments have been disabled. These helper methods are retained as no-ops
  // that immediately reject to avoid accidental use elsewhere in the app.
  async createRazorpayOrder(): Promise<never> {
    throw new Error('Payments are disabled in this deployment.');
  },

  async verifyRazorpayPayment(): Promise<never> {
    throw new Error('Payments are disabled in this deployment.');
  },

  async uploadBrochure(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload-brochure`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload brochure: ${error}`);
    }

    return response.json();
  },

  async getBrochureUrl() {
    const response = await fetch(`${API_BASE}/get-brochure-url`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get brochure URL: ${error}`);
    }

    return response.json();
  },
};
