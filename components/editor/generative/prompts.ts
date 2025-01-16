import {
    CheckCheck,
    Mountain,
    Newspaper,
    PenTool,
    RefreshCcwDot,
    Speaker,
} from "lucide-react";

import { ExplainIcon} from "../../../app/_icons/ExplainIcon"
import { SummariseIcon } from "../../../app/_icons/SummariseIcon"
import { LengthenIcon} from "../../../app/_icons/LengthenIcon"
import { ShortenIcon} from "../../../app/_icons/ShortenIcon"
import { TranslateIcon} from "../../../app/_icons/TranslateIcon"

export const languages = [
    "Arabic",
    "Italian",
    "Chinese",
    "Dutch",
    "English",
    "French",
    "German",
    "Hindi",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Spanish",
];
  
export const proses = [
    "Professional",
    "Straightforward",
    "Friendly",
    "Poetic",
    "Passive aggressive",
    "Pirate",
];

export const options = [
    {
      value: "improve",
      label: "Improve writing",
      icon: RefreshCcwDot,
    },
    {
      value: "fix",
      label: "Fix grammar",
      icon: CheckCheck,
    },
    {
      value: "shorter",
      label: "Make shorter",
      icon: ShortenIcon,
    },
    {
      value: "longer",
      label: "Make longer",
      icon: LengthenIcon,
    },
    {
      value: "summarize",
      label: "Summarize",
      icon: SummariseIcon,
    },
    {
      value: "translate",
      label: "Translate",
      icon: TranslateIcon,
    },
    {
      value: "paraphrase",
      label: "Paraphrase",
      icon: Speaker,
    },
    {
      value: "elaborate",
      label: "Elaborate",
      icon: Mountain,
    },
    {
      value: "bloggify",
      label: "Bloggify",
      icon: Newspaper,
    },
    {
      value: "prose",
      label: "Change prose",
      icon: PenTool,
    },
    {
      value: "explain",
      label: "Explain",
      icon: ExplainIcon,
    },
  ];