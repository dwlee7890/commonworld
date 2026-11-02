export const metadata = {
  title: 'Commonworld - Global Anonymous Community',
  description: 'Different languages to read, one conversation to share.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
