"use client";

import NextLink from "next/link";
import React from "react";
import { useRouter, usePathname, useSearchParams, useParams as useNextParams } from "next/navigation";

/**
 * Componente Link compatível com react-router-dom
 */
export function Link({ to, children, ...props }: any) {
  // Converte atributo "to" para "href" do Next.js
  return (
    <NextLink href={to || "/"} {...props}>
      {children}
    </NextLink>
  );
}

/**
 * Hook useNavigate compatível com react-router-dom
 */
export function useNavigate() {
  const router = useRouter();
  
  return (to: any, options?: any) => {
    // Se "to" for um número (como -1 para voltar), usamos router.back()
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
      }
      return;
    }

    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

/**
 * Hook useLocation compatível com react-router-dom
 */
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Simula o objeto location do react-router-dom
  return {
    pathname: pathname || "/",
    search: searchParams ? `?${searchParams.toString()}` : "",
    state: {}, // Next.js não suporta state em memória diretamente, mas mantemos o objeto vazio para evitar quebras
  };
}

/**
 * Hook useParams compatível com react-router-dom
 */
export function useParams<T = any>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}
