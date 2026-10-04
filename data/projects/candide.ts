import type { Project, ProjectCase } from "../types";

export const project = {
  id: "candide",
  featured: true,
  category: {
    pt: "E-commerce",
    en: "E-commerce",
  },
  title: {
    pt: "Candide",
    en: "Candide",
  },
  description: {
    pt: "Distribuidora brasileira de brinquedos com mais de 55 anos de mercado.",
    en: "Brazilian toy distributor with over 55 years in the market.",
  },
  tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
  demoUrl: "https://www.candide.com.br",
  image: {
    src: "/projects/candide-banner.webp",
    width: 1881,
    height: 877,
    focus: "50% 72%",
    alt: {
      pt: "Página inicial do e-commerce da Candide, com menu de categorias de brinquedos e banner da linha Bluey, com as pelúcias da família Heeler",
      en: "Candide e-commerce home page, with a toy category menu and a banner for the Bluey line, featuring plush toys of the Heeler family",
    },
  },
} satisfies Project;

/** Long-form sections of the project's page (`/projects/[id]`); without it the page shows only the header, image and technologies. */
// TODO: first draft from short notes, with no numbers or before/after yet. Fill the gaps flagged below before publishing.
export const projectCase = {
  sections: [
    {
      id: "menu",
      label: { pt: "Menu", en: "Menu" },
      // TODO: say what the custom menu does that VTEX's default could not (categories, layout, behavior on mobile), and any effect.
      title: {
        pt: "O menu do header virou um componente próprio, mais personalizado que o padrão da VTEX",
        en: "The header menu became a component of its own, more customized than VTEX's default",
      },
      body: [
        {
          pt: "Fui responsável por criar o menu do header da Candide. Em vez de usar o menu que vem na base da loja da VTEX, desenvolvi um componente customizado, com mais personalização do que o padrão permite.",
          en: "I was responsible for building Candide's header menu. Instead of using the menu that comes with VTEX's store base, I developed a custom component, with more customization than the default allows.",
        },
      ],
    },
    {
      id: "vitrines",
      label: { pt: "Vitrines", en: "Showcases" },
      // TODO: say what the "featured toys" showcases show and how (selection, layout, who edits them), and any effect.
      title: {
        pt: "As vitrines de brinquedos de destaque também ganharam um componente próprio",
        en: "The featured-toys showcases also got a component of their own",
      },
      body: [
        {
          pt: "Também criei as vitrines de \"brinquedos de destaque\", outro componente customizado, mais personalizado do que a vitrine padrão da loja na VTEX.",
          en: "I also built the \"featured toys\" showcases, another custom component, more customized than the store's default showcase on VTEX.",
        },
      ],
    },
    {
      id: "produto",
      label: { pt: "Produto", en: "Product" },
      // TODO: say which information comes from Master Data (specs, age range, extra details?), and why it was not in the catalog.
      title: {
        pt: "A página de produto passou a mostrar informações vindas do Master Data da VTEX",
        en: "The product page now shows information coming from VTEX Master Data",
      },
      body: [
        {
          pt: "Fui responsável pela página de produto. Nela, trouxe informações do Master Data da VTEX, o armazenamento de dados da plataforma, para exibi-las na página do produto.",
          en: "I was responsible for the product page. On it, I brought in information from VTEX Master Data, the platform's data storage, to show on the product page.",
        },
      ],
    },
  ],
} satisfies ProjectCase;
