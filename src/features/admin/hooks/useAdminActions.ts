import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useUIStore } from "../../../store/useUIStore";
import { useDeletePostMutation, useUpdatePostMutation } from "../../posts/hooks/usePostsQuery";
import { useAddCategoryMutation, useDeleteCategoryMutation } from "../../posts/hooks/useCategoriesQuery";
import { useUserProfile } from "../../../hooks/useUserQuery";
import { contactService } from "../../../services/contactService";
import { Post } from "../../posts/schemas";
import { AdminTab } from "../components/AdminTabs";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: any;
}

export function useAdminActions(posts: Post[]) {
  const { showToast } = useUIStore();
  const { currentUser, handleUpdateProfile } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);

  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const addCategoryMutation = useAddCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const [adminTab, setAdminTab] = useState<AdminTab>("posts");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    id: string | null; 
    type: 'message' | 'post' | 'category' | null; 
    title: string 
  }>({ isOpen: false, id: null, type: null, title: "" });

  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "",
    bio: "",
    level: 1,
    aka: ""
  });

  // Sincroniza dados do perfil
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        avatar: profile.avatar || "",
        bio: profile.bio || "",
        level: profile.level || 1,
        aka: profile.aka || ""
      });
    }
  }, [profile]);

  // Busca inicial de mensagens para garantir contadores corretos
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await contactService.getAllMessages();
      setMessages(data as Message[]);
    } catch (error) {
      showToast("Erro ao carregar mensagens.", "error");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: Message['status']) => {
    try {
      await contactService.updateMessageStatus(id, status);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status } : msg));
      showToast("Status da mensagem atualizado!");
    } catch (error) {
      showToast("Erro ao atualizar status.", "error");
    }
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    if (!id || !type) return;

    try {
      if (type === 'message') {
        await contactService.deleteMessage(id);
        setMessages(messages.filter(msg => msg.id !== id));
        showToast("Mensagem excluída.");
      } else if (type === 'post') {
        await deletePostMutation.mutateAsync(id);
        showToast("Artigo excluído com sucesso.");
      } else if (type === 'category') {
        const isUsed = posts.some((p) => p.category === id);
        if (isUsed) {
          showToast("Não é possível excluir: existem artigos usando esta categoria.", "error");
        } else {
          await deleteCategoryMutation.mutateAsync(id);
          showToast("Categoria removida.");
        }
      }
    } catch (error) {
      showToast(`Erro ao excluir ${type}.`, "error");
    } finally {
      setDeleteModal({ isOpen: false, id: null, type: null, title: "" });
    }
  };

  const handleReply = (email: string, name: string) => {
    const subject = encodeURIComponent(`Re: Contato BeginsProject - Olá ${name}`);
    const body = encodeURIComponent(`Olá ${name},\n\nRecebi sua mensagem através do portal BeginsProject e gostaria de dar um retorno.\n\n---\nSua mensagem:\n[Conteúdo da mensagem]\n\nMinha resposta:\n\n`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleAddCategory = async (name: string) => {
    try {
      await addCategoryMutation.mutateAsync(name);
      showToast(`Categoria "${name}" adicionada!`);
    } catch (error) {
      showToast("Erro ao adicionar categoria.", "error");
    }
  };



  const onUpdateProfile = async (data: any) => {
    try {
      await handleUpdateProfile(data);
      showToast("Perfil atualizado com sucesso!");
    } catch (error) {
      showToast("Erro ao atualizar perfil.", "error");
    }
  };

  return {
    adminTab,
    setAdminTab,
    messages,
    isLoadingMessages,
    fetchMessages,
    handleUpdateMessageStatus,
    deleteModal,
    setDeleteModal,
    confirmDelete,
    handleReply,
    handleAddCategory,
    profileData,
    onUpdateProfile,
    currentUser
  };
}
