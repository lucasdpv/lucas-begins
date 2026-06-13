import { ArrowLeft, Plus, Settings } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet-async";
import { cn } from "../lib/utils";

// Stores & Hooks
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts } from "../features/posts/hooks/usePostsQuery";
import { useCategories } from "../features/posts/hooks/useCategoriesQuery";
import { useAdminActions } from "../features/admin/hooks/useAdminActions";
import { useUpdatePostMutation } from "../features/posts/hooks/usePostsQuery";

// Components
import AdminStats from "../features/admin/components/AdminStats";
import AdminTabs from "../features/admin/components/AdminTabs";
import TabPosts from "../features/admin/components/TabPosts";
import TabCategories from "../features/admin/components/TabCategories";
import TabProfile from "../features/admin/components/TabProfile";
import TabInbox from "../features/admin/components/TabInbox";
import DeleteModal from "../features/admin/components/DeleteModal";
import TabSystem from "../features/admin/components/TabSystem";

export default function AdminPage() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { showToast } = useUIStore();
  
  // Data Fetching
  const { data: posts = [], isLoading: isLoadingPosts } = useAllPosts();
  const { data: categories = [] } = useCategories();
  const updatePostMutation = useUpdatePostMutation();

  // Logic Hook
  const {
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
  } = useAdminActions(posts);

  return (
    <div className="min-h-[80vh] py-8 px-4 md:px-8 relative overflow-hidden animate-in fade-in duration-700">
      <Helmet>
        <title>Painel de Controle | BeginsProject</title>
      </Helmet>

      {/* Elementos de Fundo Decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Superior */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12 mt-6 md:mt-8">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto relative">
            {/* Badge de Admin absoluto flutuando acima, alinhado exatamente com o início do texto do título */}
            <div className="absolute -top-7 md:-top-9 left-[60px] md:left-[80px] flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 md:px-4 py-1 bg-purple-600/10 border border-purple-500/30 rounded-full">
                <Settings size={12} className="text-purple-500 animate-spin-slow" />
                <span className="font-retro text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-purple-500">Admin Mode Active</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className={cn(
                "p-3 md:p-4 rounded-none border-4 border-black transition-all active:scale-95 group shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                isDark ? "bg-[#1f1d35] text-white hover:bg-purple-600/20" : "bg-white text-snes-dark hover:bg-gray-50"
              )}
            >
              <ArrowLeft size={20} className="md:size-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="font-retro font-bold text-2xl md:text-6xl uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Painel de <span className="text-purple-500">Controle</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/editor")}
            className="w-full md:w-auto group flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 border-4 border-black text-black font-retro text-lg font-bold uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Nova Publicação
          </button>
        </div>

        {/* Estatísticas */}
        <AdminStats 
          postsCount={posts.length}
          categoriesCount={categories.length}
          messagesCount={messages.length}
          level={currentUser?.level || 1}
          isDark={isDark}
        />

        {/* Abas */}
        <AdminTabs 
          activeTab={adminTab}
          onTabChange={setAdminTab}
          hasNewMessages={messages.some(m => m.status === 'new')}
          isDark={isDark}
        />

        {/* Conteúdo das Abas */}
        {adminTab === "posts" && (
          <TabPosts 
            posts={posts}
            categories={categories}
            isLoading={isLoadingPosts}
            isDark={isDark}
            onEdit={(id) => navigate(`/editor/${id}`)}
            onDelete={(id, title) => setDeleteModal({ isOpen: true, id, type: 'post', title })}
            onToggleFeatured={(id, isFeatured) => updatePostMutation.mutate({ id, data: { isFeatured } })}
            onToggleDraft={(id, isDraft) => updatePostMutation.mutate({ id, data: { isDraft } })}
            showToast={showToast}
          />
        )}

        {adminTab === "categories" && (
          <TabCategories 
            categories={categories}
            postsCountByCategory={(cat) => posts.filter(p => p.category === cat).length}
            onAddCategory={handleAddCategory}
            onDeleteCategory={(cat) => setDeleteModal({ isOpen: true, id: cat, type: 'category', title: cat })}
            isDark={isDark}
            showToast={showToast}
          />
        )}

        {adminTab === "profile" && (
          <TabProfile 
            initialData={profileData}
            onSave={onUpdateProfile}
            isDark={isDark}
          />
        )}

        {adminTab === "messages" && (
          <TabInbox 
            messages={messages}
            isLoading={isLoadingMessages}
            onRefresh={fetchMessages}
            onUpdateStatus={handleUpdateMessageStatus}
            onDelete={(id) => setDeleteModal({ isOpen: true, id, type: 'message', title: 'Mensagem' })}
            onReply={handleReply}
            isDark={isDark}
          />
        )}

        {adminTab === "system" && (
          <TabSystem isDark={isDark} />
        )}


        {/* Modal de Exclusão Único */}
        <DeleteModal 
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, type: null, title: "" })}
          onConfirm={confirmDelete}
          title={deleteModal.title}
          type={deleteModal.type}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
