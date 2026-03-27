import { z } from 'zod'

export const skillItemSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100).optional(),
})

export const skillCategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
  items: z.array(skillItemSchema),
})

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  github: z.string(),
  demo: z.string(),
  status: z.enum(['completed', 'in-progress', 'placeholder']),
  featured: z.boolean(),
})

export const testSuiteSchema = z.object({
  id: z.string(),
  label: z.string(),
  spec_pattern: z.string(),
})

export const siteConfigSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    email: z.string(),
    location: z.string().optional(),
    avatar: z.string().optional(),
  }),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
  }),
  resume: z.object({
    url: z.string(),
    label: z.string(),
  }),
  about: z.object({
    bio: z.string(),
    highlights: z.array(z.string()),
  }),
  skills: z.object({
    categories: z.array(skillCategorySchema),
  }),
  projects: z.array(projectSchema),
  test_runner: z.object({
    enabled: z.boolean(),
    title: z.string(),
    description: z.string(),
    default_suite: z.string(),
    available_suites: z.array(testSuiteSchema),
  }),
})

export type SkillItem = z.infer<typeof skillItemSchema>
export type SkillCategory = z.infer<typeof skillCategorySchema>
export type Project = z.infer<typeof projectSchema>
export type TestSuite = z.infer<typeof testSuiteSchema>
export type SiteConfig = z.infer<typeof siteConfigSchema>
