import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"
import prisma from '@/src/lib/prisma'

const msg = {
    to: 'gbanoaol@gmail.com',
    from: 'hola@eureka.club', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };




// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#f9f9f9"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#346df1"
  const buttonBorderColor = "#346df1"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`
}

// const prisma = new PrismaClient()

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
        server: {
            host: process.env.EMAIL_SERVER_HOST!,
            port: Number(process.env.EMAIL_SERVER_PORT!),
            auth: {
              user: process.env.EMAIL_SERVER_USER!,
              pass: process.env.EMAIL_SERVER_PASS!,
            },          
          },
          from: process.env.EMAILING_FROM,
          sendVerificationRequest:async({
            identifier: email,
            url,
            provider: { server, from },
          }) => {
            const { host } = new URL(url)
            const transport = nodemailer.createTransport(server)
            debugger;
            const res = await transport.sendMail({
              to: msg.to,
              from:process.env.EMAILING_FROM,
              subject: `Sign in to ${host}`,
              text: text({ url, host }),
              html: html({ url, host, email }),
            })
            console.log(res,'email response')
          },
          
      }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "User name", type: "text", placeholder: "User name" },
        password: {  label: "Password", type: "password", placeholder:'Password' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        debugger;
        const user = await prisma.user.findFirst({where:{
          email:credentials?.email,
          password:credentials?.password
        }})
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return {id:user.id,email:user.email,image:user.image}
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
      
    // ...add more providers here
  ],
  events:{
    createUser:async(props)=>{
      console.log(props,'createUser')
      debugger;
      const vt = await prisma.userCustomData.findFirst({where:{identifier:props.user.email}})
      debugger;
      if(vt){
        const res = await prisma.user.update({
          where:{id:+props.user.id},
          data:{
            password:vt.password
          }
        })

      }
      console.log(JSON.stringify(vt),'vt')
      debugger;
    }
  },
  // callbacks:{
  //   signIn:async (params) => {debugger;
  //     const {user,account,profile,email,credentials} = params;
  //     // if(account.provider=='email'){
  //     //   if(email && !email.verificationRequest && user.email){
  //     //     const ucd = await prisma.userCustomData.findUnique({where:{identifier:user.email}})
  //     //     const existUser = await prisma.
  //     //     const u = await prisma.user.update({
  //     //       where:{
  //     //         email:user.email
  //     //       },
  //     //       data:{
  //     //         password:ucd?.password
  //     //       }
  //     //     })
  //     //   }

  //     // }
  //     return true;
  //   }
  // },
  secret: process.env.SECRET,
  // session: {
  //   strategy: 'jwt'
  // }
})