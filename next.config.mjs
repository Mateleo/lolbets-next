/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "cdn.pandascore.co"
			},
			{
				hostname: "cdn.discordapp.com"
			},
			{
				hostname: "gyazo.com"
			},
			{
				hostname: "assets-global.website-files.com"
			}
		]
	}
}

export default nextConfig
