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
 * Suporta passagem de state em memória via sessionStorage para manter compatibilidade com Next.js App Router
 */
export function useNavigate() {
  const router = useRouter();
  
  return (to: any, options?: any) => {
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
      }
      return;
    }

    if (typeof window !== "undefined") {
      if (options?.state) {
        sessionStorage.setItem("__router_compat_state__", JSON.stringify(options.state));
      } else {
        sessionStorage.removeItem("__router_compat_state__");
      }
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

  let state: any = {};
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("__router_compat_state__");
      if (raw) {
        state = JSON.parse(raw);
      }
    } catch {
      state = {};
    }
  }

  // Simula o objeto location do react-router-dom
  return {
    pathname: pathname || "/",
    search: searchParams ? `?${searchParams.toString()}` : "",
    state,
  };
}

/**
 * Hook useParams compatível com react-router-dom
 */
export function useParams<T = any>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}
