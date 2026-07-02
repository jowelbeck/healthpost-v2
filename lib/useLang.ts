"use client";
import { useState, useEffect } from "react";
import { hp_t, HpLang } from "./translations";

export function useHpLang() {
  const [lang, setLangState] = useState<HpLang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("hp_lang") as HpLang;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: HpLang) => {
    setLangState(l);
    localStorage.setItem("hp_lang", l);
  };

  const t = hp_t(lang);
  return { lang, setLang, t };
}
