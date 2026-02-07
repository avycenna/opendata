import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  site: {
    title: "Open Data API Documentation",
    logo: {
      src: {
        light: "/logo-light.png",
        dark: "/logo-dark.png",
      },
      alt: "Avycenna Logo",
      href: "/",
    },
    banner: {
      message: "This project is in early development. Please report any issues or feedback on our GitHub repository.",
      color: "note",
      dismissible: true
    }
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            "/introduction",
            "/sdks-and-tools",
            {
              type: "link",
              icon: "folder-cog",
              badge: {
                label: "New",
                color: "purple",
              },
              label: "API Reference",
              to: "/api",
            },
          ],
        },
        {
          type: "category",
          label: "Useful Links",
          collapsible: false,
          icon: "link",
          items: [
            {
              type: "link",
              icon: "github",
              label: "GitHub Repo",
              to: "https://github.com/avycenna/opendata",
            },
            {
              type: "link",
              icon: "server",
              label: "Avycenna",
              to: "https://avycenna.com/",
            },
            {
              type: "link",
              icon: "landmark",
              label: "ADD",
              to: "https://add.gov.ma/",
            },
            {
              type: "link",
              icon: "database",
              label: "Open Data",
              to: "https://data.gov.ma/",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      to: "/guide",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "./apis/openapi.json",
      path: "/api",
    },
  ],
};

export default config;
