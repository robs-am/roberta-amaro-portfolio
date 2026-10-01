import type { Project, ProjectCase } from "../types";

export const project = {
  id: "creamy",
  featured: true,
  category: {
    pt: "E-commerce",
    en: "E-commerce",
  },
  title: {
    pt: "Creamy Skincare",
    en: "Creamy Skincare",
  },
  description: {
    pt: "Marca de dermocosméticos que já ultrapassou R$1 bilhão em faturamento acumulado.",
    en: "Dermocosmetics brand that has already surpassed R$1 billion in cumulative revenue.",
  },
  tech: ["React", "TypeScript", "Tailwind CSS", "VTEX"],
  demoUrl: "https://www.creamy.com.br",
  image: {
    src: "/projects/creamy-thumb.webp",
    width: 1440,
    height: 807,
    focus: "50% 33%",
    alt: {
      pt: "Página inicial do e-commerce da Creamy Skincare, com banner de 15% de desconto no Pix e foto de uma mulher se olhando no espelho segurando produtos da linha",
      en: "Creamy Skincare e-commerce home page, with a 15%-off banner and a photo of a woman looking in a mirror holding products from the line",
    },
  },
} satisfies Project;

/** Long-form sections of the project's page (`/projects/[id]`); without it the page shows only the header, image and technologies. */
// TODO: first draft from short notes, with no numbers or before/after yet. Fill the gaps flagged below before publishing.
export const projectCase = {
  sections: [
    {
      id: "personalizacao",
      label: { pt: "Personalização", en: "Customization" },
      title: {
        pt: "O time do Creamy passou a editar badges, fotos e textos sozinho",
        en: "The Creamy team can now edit badges, photos and copy on their own",
      },
      body: [
        {
          pt: "No time do e-commerce, criei componentes e inúmeras landing pages, de campanha, de produto, de FAQ e de Black Friday, pensados para dar ao cliente o máximo de controle possível. Badges, fotos e textos, nas páginas e nos produtos, são editados por eles, sem depender de um desenvolvedor a cada campanha.",
          en: "On the e-commerce team, I built components and countless landing pages, for campaigns, products, FAQs and Black Friday, designed to give the client as much control as possible. Badges, photos and copy, across pages and products, are edited by them, without needing a developer for every campaign.",
        },
      ],
    },
    {
      id: "descontos",
      label: { pt: "Descontos", en: "Discounts" },
      // TODO: add a concrete example rule, or a number on speed, if there is one.
      title: {
        pt: "Os descontos passaram a somar certo, e o carrinho a atualizar rápido",
        en: "Discounts now add up correctly, and the cart updates fast",
      },
      body: [
        {
          pt: "O carrinho tinha dois problemas: demorava para atualizar e, em algumas combinações, os descontos não somavam ou o cálculo saía errado. Otimizei a lógica de aplicação de descontos para corrigir os dois.",
          en: "The cart had two problems: it was slow to update and, in some combinations, discounts didn't add up or the calculation came out wrong. I optimized the discount logic to fix both.",
        },
      ],
    },
    {
      id: "pagamento",
      label: { pt: "Pagamento", en: "Payment" },
      // TODO: add what else changed in the checkout flow, or an effect on sales, if there is one.
      title: {
        pt: "O cliente passou a combinar duas formas de pagamento sem perder o desconto",
        en: "Customers can now combine two payment methods without losing the discount",
      },
      body: [
        {
          pt: "No checkout, incluí o cartão com parcelamento diferente. Com isso, o cliente consegue aproveitar o desconto pagando com duas formas de pagamento combinadas, o que incentiva compras de maior volume.",
          en: "In the checkout, I added card payment with different installment options. With that, customers can still get the discount by paying with two payment methods combined, which encourages larger purchases.",
        },
      ],
    },
  ],
} satisfies ProjectCase;
