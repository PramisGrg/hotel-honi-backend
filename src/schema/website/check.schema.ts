import { z } from "zod";

export const checkDomainNameSchema = z.object({
  domainName: z.string({ message: "Domain name must be valid." }),
  isCustomDomain: z.boolean({ message: "Please specify if the domain name is custom or not." }),
  isNewCustomDomain: z.boolean({ message: "Please specify if the domain name is new or not." })
})


export type TCheckDomainNameSchema = z.infer<typeof checkDomainNameSchema>
