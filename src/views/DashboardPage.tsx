import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useUserProfile } from "../hooks/useUserQuery";
import { usePostsByIds } from "../features/posts/hooks/usePostsQuery";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { cn, getPixelAvatar } from "../lib/utils";
import {
  Star,
  Trophy,
  MessageSquare,
  Bookmark,
  ChevronRight,
  Gamepad2,
  Zap,
  Info,
  Edit,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import PostCard from "../features/posts/components/PostCard";
import ImageUpload from "../components/ui/ImageUpload";

export default function DashboardPage() {
  const { currentUser, handleUpdateProfile } = useAuth();
  const { isDark } = useThemeStore();
  const { showToast } = useUIStore();
  const { data: profile } = useUserProfile(currentUser?.id);

  const favoriteIds = profile?.favorites || [];
  const { data: favoritePosts = [] } = usePostsByIds(favoriteIds);
  const totalComments = profile?.commentsCount || 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    aka: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || "",
        aka: profile.aka || "",
        bio: profile.bio || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  const onSaveProfile = async () => {
    try {
      await handleUpdateProfile(editData);
      setIsEditing(false);
    } catch {
      // handled by AuthProvider
    }
  };

  const handleResetProfile = async () => {
    if (!currentUser) return;
    if (
      window.confirm("Deseja resetar seu XP, Nível e Histórico? Essa ação não pode ser desfeita.")
    ) {
      try {
        await handleUpdateProfile({
          xp: 0,
          level: 1,
          readPosts: [],
          favorites: [],
        });
        showToast("Seu progresso foi resetado! 🎮");
      } catch {
        showToast("Erro ao resetar perfil.", "error");
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gamepad2 className="w-16 h-16 text-purple-400 mb-6 animate-bounce" />
        <h2 className="font-retro text-3xl font-black uppercase mb-3 text-white">
          Acesso Bloqueado
        </h2>
        <p className="text-slate-400 max-w-md">
          Você precisa estar logado para acessar seu QG (Dashboard).
        </p>
      </div>
    );
  }

  const xpLimit = (profile?.level || 1) * 100;
  const xpPercentage = Math.min(((profile?.xp || 0) / xpLimit) * 100, 100);

  const badges = [
    {
      id: "early-bird",
      icon: <Zap className="w-5 h-5" />,
      label: "Early Bird",
      color: "bg-amber-500",
      active: true,
      description: "Membro da fase inicial do portal.",
    },
    {
      id: "commenter",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Conversador",
      color: "bg-sky-500",
      active: totalComments > 0,
      description: "Deixe seu primeiro comentário.",
    },
    {
      id: "collector",
      icon: <Bookmark className="w-5 h-5" />,
      label: "Colecionador",
      color: "bg-purple-500",
      active: (profile?.favorites?.length || 0) >= 1,
      description: "Salve ao menos 1 artigo no seu inventário.",
    },
    {
      id: "veteran",
      icon: <Trophy className="w-5 h-5" />,
      label: "Veterano",
      color: "bg-rose-500",
      active: (profile?.level || 1) >= 5,
      description: "Alcance o nível 5 de experiência.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header do Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Card de Perfil */}
        <div
          className={cn(
            "lg:col-span-2 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center gap-8 relative overflow-hidden",
            isDark
              ? "bg-[#121024]/90 border-white/[0.08] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
              : "bg-white border-slate-200 text-slate-900 shadow-lg"
          )}
        >
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl border border-purple-500/40 overflow-hidden shadow-[0_14px_34px_rgba(168,85,247,0.25)]">
              <img
                src={profile?.avatar || getPixelAvatar(currentUser.id)}
                alt={profile?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPixelAvatar(currentUser.id);
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full font-retro font-black text-xs shadow-lg">
              LVL {profile?.level || 1}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-retro font-bold uppercase text-purple-300 tracking-wider">
                      Nome do Player
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white outline-none font-bold text-sm focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-retro font-bold uppercase text-purple-300 tracking-wider">
                      Codinome (AKA)
                    </label>
                    <input
                      type="text"
                      value={editData.aka}
                      onChange={(e) => setEditData({ ...editData, aka: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white outline-none font-bold text-sm focus:border-purple-500"
                      placeholder="Ex: Player 1"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-retro font-bold uppercase text-purple-300 tracking-wider">
                    Bio / Descrição
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white outline-none font-medium text-sm resize-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <ImageUpload
                    label="Avatar (Upload ou Link)"
                    initialValue={editData.avatar}
                    onUploadComplete={(url) => setEditData({ ...editData, avatar: url })}
                    folder="avatars"
                    circular={true}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onSaveProfile}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl py-2.5 font-retro text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check size={15} /> Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white/[0.06] hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/10 rounded-xl py-2.5 font-retro text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X size={15} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-retro text-2xl md:text-4xl font-black uppercase mb-1.5 tracking-tight">
                  {profile?.name}
                  {profile?.aka && (
                    <span className="text-sm md:text-lg text-purple-400 ml-3 font-bold">
                      (aka {profile.aka})
                    </span>
                  )}
                </h1>
                <p className="text-slate-400 font-mono mb-3 uppercase tracking-widest text-[11px]">
                  ID: {profile?.id?.substring(0, 8)}...
                </p>
                <p className="text-xs md:text-sm font-medium mb-6 line-clamp-2 max-w-xl text-slate-300">
                  {profile?.bio ||
                    "Nenhuma biografia definida ainda. Clique em editar para contar sua história!"}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Barra de XP */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-retro text-[10px] font-black uppercase tracking-widest text-purple-400">
                        Experiência (XP)
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {profile?.xp || 0} / {xpLimit}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-white/[0.05] border border-white/10 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${xpPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-purple-400/40 bg-purple-600 hover:bg-purple-500 text-white font-retro text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                  >
                    <Edit size={14} /> Editar Perfil
                  </button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-retro text-xs font-black uppercase transition-all cursor-pointer"
                    title="Resetar meu progresso"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card de Estatísticas Rápidas */}
        <div
          className={cn(
            "p-6 sm:p-8 rounded-3xl border flex flex-col justify-between",
            isDark
              ? "bg-[#121024]/90 border-white/[0.08] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
              : "bg-white border-slate-200 text-slate-900 shadow-lg"
          )}
        >
          <h3 className="font-retro text-lg font-black uppercase mb-6 flex items-center gap-2.5 text-white">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Stats do Player
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.07] pb-3">
              <span className="font-bold uppercase text-xs tracking-wider text-slate-400">
                Favoritos Salvos
              </span>
              <span className="font-retro font-black text-2xl text-purple-300">
                {profile?.favorites?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/[0.07] pb-3">
              <span className="font-bold uppercase text-xs tracking-wider text-slate-400">
                Comentários
              </span>
              <span className="font-retro font-black text-2xl text-sky-300">{totalComments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase text-xs tracking-wider text-slate-400">
                Rank Atual
              </span>
              <span className="font-retro font-black text-sm text-amber-400 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
                Bronze I
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Emblemas + Favoritos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Barra Lateral: Emblemas */}
        <div className="lg:col-span-1 space-y-6">
          <section className="p-6 rounded-3xl border border-white/[0.08] bg-[#121024]/90">
            <h3 className="font-retro text-lg font-black uppercase mb-5 flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-amber-400" /> Conquistas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all group relative overflow-hidden",
                    badge.active
                      ? "bg-white/[0.04] border-purple-500/40 opacity-100"
                      : "opacity-30 grayscale border-white/10"
                  )}
                >
                  <div className="absolute inset-0 z-10 opacity-0 lg:group-hover:opacity-100 transition-opacity bg-[#090812]/95 flex items-center justify-center p-2 text-center pointer-events-none">
                    <p className="text-[9px] text-slate-200 font-bold uppercase leading-tight">
                      {badge.description}
                    </p>
                  </div>

                  <div className={cn("p-2.5 rounded-xl", badge.active ? badge.color : "bg-slate-700")}>
                    {React.cloneElement(badge.icon as React.ReactElement<any>, {
                      className: "w-5 h-5 text-white",
                    })}
                  </div>
                  <span className="text-[10px] font-bold uppercase font-retro leading-tight text-white">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-3xl border border-white/[0.08] bg-[#121024]/90">
            <h4 className="font-retro text-xs font-black uppercase tracking-widest mb-3 text-purple-400 flex items-center gap-2">
              <Info className="w-4 h-4" /> Sistema de XP
            </h4>
            <p className="text-xs font-medium leading-relaxed text-slate-400 mb-4">
              Ganhe XP realizando ações no portal para subir de nível e desbloquear emblemas:
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-300">Curtir Matéria</span>
                <span className="text-emerald-400 font-bold">+5 XP</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-300">Salvar Favorito</span>
                <span className="text-emerald-400 font-bold">+15 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Comentar</span>
                <span className="text-emerald-400 font-bold">+20 XP</span>
              </div>
            </div>
          </section>
        </div>

        {/* Conteúdo Principal: Meus Favoritos */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-retro text-2xl font-black uppercase flex items-center gap-3 text-white">
              <Bookmark className="w-6 h-6 text-purple-400" /> Minha Lista de Favoritos
            </h3>
            <span className="text-xs font-mono uppercase text-slate-400">
              {favoritePosts.length} títulos salvos
            </span>
          </div>

          {favoritePosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePosts.map((post, idx) => (
                <PostCard key={post.id} post={post} variant="compact" priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center">
              <Bookmark className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-300 font-bold uppercase text-sm font-retro">
                Sua lista de favoritos está vazia
              </p>
              <Link
                to="/archive"
                className="mt-4 px-5 py-2.5 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white font-retro font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-1.5"
              >
                Explorar Catálogo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
