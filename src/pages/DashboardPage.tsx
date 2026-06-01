import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useUserProfile } from '../hooks/useUserQuery';
import { usePostsByIds } from '../features/posts/hooks/usePostsQuery';
import { useThemeStore } from '../store/useThemeStore';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../lib/utils';
import { Star, Trophy, MessageSquare, Bookmark, ChevronRight, Gamepad2, Zap, Info, Edit, X, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PostCard from '../features/posts/components/PostCard';
import ImageUpload from '../components/ui/ImageUpload';
import { getPixelAvatar } from '../lib/utils';

export default function DashboardPage() {

  const { currentUser, handleUpdateProfile } = useAuth();
  const { isDark } = useThemeStore();
  const { showToast } = useUIStore();
  const { data: profile } = useUserProfile(currentUser?.id);

  // 1. Busca os posts favoritados de forma otimizada (apenas IDs necessários, economizando 99% de leituras)
  const favoriteIds = profile?.favorites || [];
  const { data: favoritePosts = [] } = usePostsByIds(favoriteIds);

  // 2. Obtém a contagem de comentários diretamente do perfil do usuário
  const totalComments = profile?.commentsCount || 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    aka: "",
    bio: "",
    avatar: ""
  });

  // Sincroniza dados locais com o perfil do banco
  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || "",
        aka: profile.aka || "",
        bio: profile.bio || "",
        avatar: profile.avatar || ""
      });
    }
  }, [profile]);

  const onSaveProfile = async () => {
    try {
      await handleUpdateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      // O toast já é mostrado pelo handleUpdateProfile no AuthProvider
    }
  };

  const handleResetProfile = async () => {
    if (!currentUser) return;
    if (window.confirm("Deseja resetar seu XP, Nível e Histórico? Essa ação não pode ser desfeita.")) {
      try {
        await handleUpdateProfile({
          xp: 0,
          level: 1,
          readPosts: [],
          favorites: []
        });
        showToast("Seu progresso foi resetado! 🎮");
      } catch (error) {
        showToast("Erro ao resetar perfil.", "error");
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gamepad2 className="w-16 h-16 text-purple-500 mb-6 animate-bounce" />
        <h2 className="font-retro text-3xl font-bold uppercase mb-4">Acesso Bloqueado</h2>
        <p className="text-gray-500 max-w-md">Você precisa estar logado para acessar seu QG (Dashboard).</p>
      </div>
    );
  }



  // Cálculo de XP para a barra de progresso
  const xpLimit = (profile?.level || 1) * 100;
  const xpPercentage = Math.min(((profile?.xp || 0) / xpLimit) * 100, 100);

  // Emblemas (Lógica reativa)
  const badges = [
    { 
      id: 'early-bird', 
      icon: <Zap className="w-5 h-5" />, 
      label: 'Early Bird', 
      color: 'bg-yellow-500', 
      active: true,
      description: 'Membro da fase inicial do blog.'
    },
    { 
      id: 'commenter', 
      icon: <MessageSquare className="w-5 h-5" />, 
      label: 'Conversador', 
      color: 'bg-blue-500', 
      active: totalComments > 0,
      description: 'Deixe seu primeiro comentário.'
    },
    { 
      id: 'collector', 
      icon: <Bookmark className="w-5 h-5" />, 
      label: 'Colecionador', 
      color: 'bg-purple-500', 
      active: (profile?.favorites?.length || 0) >= 1,
      description: 'Salve ao menos 1 artigo no seu inventário.'
    },
    { 
      id: 'veteran', 
      icon: <Trophy className="w-5 h-5" />, 
      label: 'Veterano', 
      color: 'bg-red-500', 
      active: (profile?.level || 1) >= 5,
      description: 'Alcance o nível 5 de experiência.'
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>Meu QG | BeginsProject</title>
      </Helmet>

      {/* Header do Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Card de Perfil */}
        <div className={cn(
          "lg:col-span-2 p-8 rounded-none border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden",
          isDark ? "bg-gray-800" : "bg-white"
        )}>
          {/* Efeito de Scanline */}
          <div className="absolute inset-0 scanline-overlay opacity-10 pointer-events-none" />
          
          <div className="relative shrink-0">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_rgba(168,85,247,0.5)]">
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
             <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black border-2 border-black px-4 py-2 font-retro font-bold text-sm rotate-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
               LVL {profile?.level}
             </div>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-retro font-bold uppercase opacity-50">Nome do Player</label>
                    <input 
                      type="text" 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className={cn(
                        "w-full p-3 border-2 border-black outline-none font-bold text-sm",
                        isDark ? "bg-gray-900 text-white focus:border-purple-500" : "bg-gray-50 focus:border-purple-600"
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-retro font-bold uppercase opacity-50">Codinome (AKA)</label>
                    <input 
                      type="text" 
                      value={editData.aka}
                      onChange={(e) => setEditData({...editData, aka: e.target.value})}
                      className={cn(
                        "w-full p-3 border-2 border-black outline-none font-bold text-sm",
                        isDark ? "bg-gray-900 text-white focus:border-purple-500" : "bg-gray-50 focus:border-purple-600"
                      )}
                      placeholder="Ex: Player 1"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-retro font-bold uppercase opacity-50">Bio / Descrição</label>
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    rows={2}
                    className={cn(
                      "w-full p-3 border-2 border-black outline-none font-medium text-sm resize-none",
                      isDark ? "bg-gray-900 text-white focus:border-purple-500" : "bg-gray-50 focus:border-purple-600"
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <ImageUpload 
                    label="Avatar (Upload ou Link)"
                    initialValue={editData.avatar}
                    onUploadComplete={(url) => setEditData({...editData, avatar: url})}
                    folder="avatars"
                    circular={true}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={onSaveProfile}
                    className="flex-1 bg-green-500 text-black border-2 border-black py-2 font-retro text-[10px] font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={14} /> Salvar Alterações
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-red-500 text-white border-2 border-black py-2 font-retro text-[10px] font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-retro text-3xl md:text-4xl font-bold uppercase mb-2 tracking-tight">
                  {profile?.name}
                  {profile?.aka && <span className="text-sm md:text-lg text-purple-500 ml-3 opacity-80">(aka {profile.aka})</span>}
                </h1>
                <p className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-xs">
                  ID: {profile?.id?.substring(0, 8)}...
                </p>
                <p className={cn("text-xs md:text-sm font-medium mb-6 line-clamp-2 max-w-xl", isDark ? "text-gray-400" : "text-gray-600")}>
                  {profile?.bio || "Nenhuma biografia definida ainda. Clique em editar para contar sua história!"}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                  {/* Barra de XP */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-retro text-[10px] font-bold uppercase text-purple-500">Experiência (XP)</span>
                      <span className="font-retro text-[10px] font-bold text-gray-400">{profile?.xp} / {xpLimit}</span>
                    </div>
                    <div className="h-8 w-full bg-black/30 border-[3px] border-black p-1 rounded-sm overflow-hidden relative shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
                      {/* Grid de Fundo (Retro Pattern) */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '12px 100%' }} 
                      />
                      
                      <div 
                        className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-400 transition-all duration-1000 ease-out relative group"
                        style={{ width: `${xpPercentage}%` }}
                      >
                        {/* Efeito Glossy Superior */}
                        <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/30 to-transparent" />
                        
                        {/* Sombra Inferior Interna */}
                        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-black/20" />
                        
                        {/* Brilho Pulsante Neon */}
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        
                        {/* Indicador de Fim (Laser Line) */}
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_15px_rgba(168,85,247,1)]" />
                      </div>

                      {/* Scanlines Específicas da Barra */}
                      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEditing(true)}
                    className={cn(
                      "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-retro text-[10px] font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all",
                      isDark ? "bg-purple-600 text-white" : "bg-yellow-400 text-black"
                    )}
                  >
                    <Edit size={14} /> Editar Perfil
                  </button>

                  <button 
                    onClick={handleResetProfile}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 border-2 border-black bg-red-500 text-white font-retro text-[10px] font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all"
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
        <div className={cn(
          "p-8 rounded-none border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between",
          isDark ? "bg-gray-900 border-purple-500" : "bg-purple-600 text-white"
        )}>
          <h3 className="font-retro text-xl font-bold uppercase mb-6 flex items-center gap-2">
             <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" /> Stats de Jogo
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b-2 border-black/20 pb-2">
               <span className="font-bold uppercase text-sm opacity-80">Favoritos</span>
               <span className="font-retro text-2xl">{profile?.favorites?.length || 0}</span>
             </div>
             <div className="flex justify-between items-center border-b-2 border-black/20 pb-2">
               <span className="font-bold uppercase text-sm opacity-80">Comentários</span>
               <span className="font-retro text-2xl">{totalComments}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="font-bold uppercase text-sm opacity-80">Rank</span>
               <span className="font-retro text-sm text-yellow-400">Bronze I</span>
             </div>
          </div>
        </div>
      </div>

      {/* Guia de Progressão Quick View (Visível no Mobile) */}
      <div className="lg:hidden mb-8">
        <section className={cn(
          "p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
          isDark ? "bg-blue-900/10 border-blue-500/30" : "bg-blue-50"
        )}>
          <h4 className="font-retro text-xs font-bold uppercase mb-3 text-blue-600 flex items-center gap-2">
            <Info className="w-4 h-4" /> Como subir de nível?
          </h4>
          <p className="text-[10px] leading-tight opacity-70 mb-2">
            Curta (+5 XP), Salve (+15 XP) ou Comente (+20 XP) nos posts para evoluir!
          </p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Barra Lateral: Emblemas */}
        <div className="lg:col-span-1 space-y-8">
          <section>
            <h3 className="font-retro text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" /> Emblemas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map(badge => (
                <div 
                  key={badge.id}
                   className={cn(
                    "p-4 border-2 border-black flex flex-col items-center gap-2 text-center transition-all group relative",
                    badge.active 
                      ? (isDark ? "bg-gray-800 border-purple-500 opacity-100" : "bg-white opacity-100 shadow-[4px_4px_0px_rgba(0,0,0,1)]")
                      : "opacity-20 grayscale border-dashed"
                  )}
                >
                  {/* Tooltip de regra (Desktop) */}
                  <div className="absolute inset-0 z-10 opacity-0 lg:group-hover:opacity-100 transition-opacity bg-black/90 flex items-center justify-center p-2 text-center pointer-events-none">
                    <p className="text-[8px] text-white font-bold uppercase leading-tight">
                      {badge.description}
                    </p>
                  </div>
                  
                  <div className={cn("p-2 rounded-full", badge.active ? badge.color : "bg-gray-500")}>
                    {React.cloneElement(badge.icon as React.ReactElement<any>, { className: "w-6 h-6 text-white" })}
                  </div>
                  <span className="text-[9px] font-bold uppercase font-retro leading-tight">
                    {badge.label}
                  </span>

                  {/* Descrição fixa (Mobile) */}
                  <p className="lg:hidden text-[7px] font-bold uppercase opacity-60 leading-none mt-1">
                    {badge.active ? "Conquistado!" : badge.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className={cn(
            "p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
            isDark ? "bg-blue-900/10 border-blue-500/30" : "bg-blue-50"
          )}>
            <h4 className="font-retro text-sm font-bold uppercase mb-3 text-blue-600 flex items-center gap-2">
              <Info className="w-4 h-4" /> Regras de Conquista
            </h4>
            <ul className="space-y-2">
              {badges.map(b => (
                <li key={b.id} className="text-[9px] font-bold uppercase flex items-start gap-2">
                  <span className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", b.active ? "bg-green-500" : "bg-gray-400")} />
                  <span className="opacity-70">{b.label}: {b.description}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={cn(
            "p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
            isDark ? "bg-purple-900/10 border-purple-500/30" : "bg-purple-50"
          )}>
            <h4 className="font-retro text-sm font-bold uppercase mb-3 text-purple-600 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Sistema de Nível
            </h4>
            <div className="space-y-3">
              <p className="text-[10px] font-medium leading-relaxed opacity-70">
                Ganhe XP realizando ações no blog para subir de nível e desbloquear novos títulos!
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between text-[8px] font-bold uppercase border-b border-black/10 pb-1">
                  <span>Curtir Post</span>
                  <span className="text-green-500">+5 XP</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold uppercase border-b border-black/10 pb-1">
                  <span>Salvar Post</span>
                  <span className="text-green-500">+15 XP</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold uppercase">
                  <span>Comentar</span>
                  <span className="text-green-500">+20 XP</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Conteúdo Principal: Meus Favoritos */}
        <div className="lg:col-span-3 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="font-retro text-2xl font-bold uppercase flex items-center gap-3">
                <Bookmark className="w-7 h-7 text-purple-500" /> Inventário de Favoritos
              </h3>
              <span className="text-xs font-bold uppercase opacity-40">{favoritePosts.length} itens salvos</span>
           </div>

           {favoritePosts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritePosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    variant="compact"
                  />
                ))}
             </div>
           ) : (
             <div className={cn(
               "py-20 text-center rounded-none border-4 border-dashed border-gray-300 flex flex-col items-center",
               isDark ? "border-gray-700 bg-gray-800/30" : "bg-gray-50"
             )}>
               <Bookmark className="w-12 h-12 text-gray-300 mb-4" />
               <p className="text-gray-400 font-bold uppercase text-sm font-retro">Seu inventário está vazio</p>
               <Link to="/" className="mt-4 text-purple-500 font-bold uppercase text-xs hover:underline flex items-center gap-1">
                  Explorar Artigos <ChevronRight className="w-4 h-4" />
               </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
