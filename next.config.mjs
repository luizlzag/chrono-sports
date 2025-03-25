/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      domains: ['cdn.awsli.com.br', 'i.postimg.cc', 'img.freepik.com'], // Adicione os domínios que você quer permitir
    },
};

export default nextConfig;
