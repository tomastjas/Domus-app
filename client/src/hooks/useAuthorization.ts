import { useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

export interface AuthorizedUser {
  email: string;
  name: string;
  authorizedAt: string;
}

export interface AccessRequest {
  id: string;
  email: string;
  name: string;
  message: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
}

export interface InviteLink {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
  active: boolean;
}

const AUTHORIZED_USERS_KEY = 'domus_authorized_users';
const ACCESS_REQUESTS_KEY = 'domus_access_requests';
const INVITE_LINKS_KEY = 'domus_invite_links';
export const ADMIN_EMAILS = ['juffamilia@gmail.com', 'tomasjefferson092@gmail.com'];

export function useAuthorization() {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedUsers = localStorage.getItem(AUTHORIZED_USERS_KEY);
        if (storedUsers) setAuthorizedUsers(JSON.parse(storedUsers));

        const storedRequests = localStorage.getItem(ACCESS_REQUESTS_KEY);
        if (storedRequests) {
          const parsed = JSON.parse(storedRequests);
          setAccessRequests(parsed);
          setPendingCount(parsed.filter((r: AccessRequest) => r.status === 'pending').length);
        }

        const storedInvites = localStorage.getItem(INVITE_LINKS_KEY);
        if (storedInvites) setInviteLinks(JSON.parse(storedInvites));
      } catch (e) {
        console.error('Erro ao carregar dados de autorização:', e);
      }
    };

    loadData();

    // Sincronizar entre abas quando localStorage muda
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACCESS_REQUESTS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setAccessRequests(parsed);
          setPendingCount(parsed.filter((r: AccessRequest) => r.status === 'pending').length);
        } catch (err) {
          console.error('Erro ao sincronizar solicitações:', err);
        }
      } else if (e.key === AUTHORIZED_USERS_KEY && e.newValue) {
        try {
          setAuthorizedUsers(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Erro ao sincronizar usuários:', err);
        }
      } else if (e.key === INVITE_LINKS_KEY && e.newValue) {
        try {
          setInviteLinks(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Erro ao sincronizar convites:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Salvar usuários autorizados
  const saveAuthorizedUsers = useCallback((users: AuthorizedUser[]) => {
    localStorage.setItem(AUTHORIZED_USERS_KEY, JSON.stringify(users));
    setAuthorizedUsers(users);
  }, []);

  // Salvar solicitações
  const saveAccessRequests = useCallback((requests: AccessRequest[]) => {
    localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(requests));
    setAccessRequests(requests);
    const pending = requests.filter(r => r.status === 'pending').length;
    setPendingCount(pending);
    // Disparar evento customizado para notificar outras abas
    window.dispatchEvent(new CustomEvent('domus:requests-updated', { detail: { requests, pendingCount: pending } }));
  }, []);

  // Salvar convites
  const saveInviteLinks = useCallback((invites: InviteLink[]) => {
    localStorage.setItem(INVITE_LINKS_KEY, JSON.stringify(invites));
    setInviteLinks(invites);
  }, []);

  // Verificar se um email é admin
  const isAdmin = useCallback((email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  }, []);

  // Verificar se um email está autorizado
  const isAuthorized = useCallback((email: string): boolean => {
    return isAdmin(email) || authorizedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
  }, [authorizedUsers, isAdmin]);

  // Adicionar um novo usuário autorizado
  const authorizeUser = useCallback((email: string, name: string) => {
    if (!isAuthorized(email)) {
      const newUser: AuthorizedUser = {
        email: email.toLowerCase(),
        name,
        authorizedAt: new Date().toISOString(),
      };
      const updated = [...authorizedUsers, newUser];
      saveAuthorizedUsers(updated);
      return true;
    }
    return false;
  }, [authorizedUsers, isAuthorized, saveAuthorizedUsers]);

  // Remover um usuário autorizado
  const revokeUser = useCallback((email: string) => {
    if (!isAdmin(email)) {
      const updated = authorizedUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      saveAuthorizedUsers(updated);
      return true;
    }
    return false;
  }, [authorizedUsers, isAdmin, saveAuthorizedUsers]);

  // === SOLICITAÇÕES DE ACESSO ===

  // Criar nova solicitação
  const createAccessRequest = useCallback((email: string, name: string, message: string) => {
    const existing = accessRequests.find(
      r => r.email.toLowerCase() === email.toLowerCase() && r.status === 'pending'
    );
    if (existing) return false;

    const newRequest: AccessRequest = {
      id: nanoid(10),
      email: email.toLowerCase(),
      name,
      message,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newRequest, ...accessRequests];
    saveAccessRequests(updated);
    return true;
  }, [accessRequests, saveAccessRequests]);

  // Aprovar solicitação
  const approveRequest = useCallback((requestId: string) => {
    const updated = accessRequests.map(r => {
      if (r.id === requestId && r.status === 'pending') {
        authorizeUser(r.email, r.name);
        return { ...r, status: 'approved' as const, reviewedAt: new Date().toISOString() };
      }
      return r;
    });
    saveAccessRequests(updated);
  }, [accessRequests, authorizeUser, saveAccessRequests]);

  // Rejeitar solicitação
  const rejectRequest = useCallback((requestId: string) => {
    const updated = accessRequests.map(r => {
      if (r.id === requestId && r.status === 'pending') {
        return { ...r, status: 'rejected' as const, reviewedAt: new Date().toISOString() };
      }
      return r;
    });
    saveAccessRequests(updated);
  }, [accessRequests, saveAccessRequests]);

  // Deletar solicitação
  const deleteRequest = useCallback((requestId: string) => {
    const updated = accessRequests.filter(r => r.id !== requestId);
    saveAccessRequests(updated);
  }, [accessRequests, saveAccessRequests]);

  // Obter solicitações pendentes
  const getPendingRequests = useCallback((): AccessRequest[] => {
    return accessRequests.filter(r => r.status === 'pending');
  }, [accessRequests]);

  // === SISTEMA DE CONVITES ===

  // Criar novo convite
  const createInvite = useCallback((createdBy: string, expiresInHours: number = 72) => {
    const code = nanoid(12);
    const newInvite: InviteLink = {
      id: nanoid(10),
      code,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString(),
      active: true,
    };
    const updated = [newInvite, ...inviteLinks];
    saveInviteLinks(updated);
    return code;
  }, [inviteLinks, saveInviteLinks]);

  // Usar convite
  const useInvite = useCallback((code: string, email: string, name: string): boolean => {
    const invite = inviteLinks.find(
      i => i.code === code && i.active && !i.usedBy && new Date(i.expiresAt) > new Date()
    );
    if (!invite) return false;

    // Marcar convite como usado
    const updatedInvites = inviteLinks.map(i => {
      if (i.id === invite.id) {
        return { ...i, usedBy: email, usedAt: new Date().toISOString(), active: false };
      }
      return i;
    });
    saveInviteLinks(updatedInvites);

    // Autorizar o usuário
    authorizeUser(email, name);
    return true;
  }, [inviteLinks, saveInviteLinks, authorizeUser]);

  // Revogar convite
  const revokeInvite = useCallback((inviteId: string) => {
    const updated = inviteLinks.map(i => {
      if (i.id === inviteId) {
        return { ...i, active: false };
      }
      return i;
    });
    saveInviteLinks(updated);
  }, [inviteLinks, saveInviteLinks]);

  // Deletar convite
  const deleteInvite = useCallback((inviteId: string) => {
    const updated = inviteLinks.filter(i => i.id !== inviteId);
    saveInviteLinks(updated);
  }, [inviteLinks, saveInviteLinks]);

  // Verificar se convite é válido
  const isValidInvite = useCallback((code: string): boolean => {
    return inviteLinks.some(
      i => i.code === code && i.active && !i.usedBy && new Date(i.expiresAt) > new Date()
    );
  }, [inviteLinks]);

  return {
    // Autorização
    isAuthorized,
    isAdmin,
    authorizeUser,
    revokeUser,
    authorizedUsers,
    // Solicitações
    createAccessRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
    getPendingRequests,
    accessRequests,
    pendingCount,
    // Convites
    createInvite,
    useInvite,
    revokeInvite,
    deleteInvite,
    isValidInvite,
    inviteLinks,
  };
}
