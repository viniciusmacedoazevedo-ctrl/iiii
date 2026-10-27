import type { ComponentType } from 'react'
import type { Mood } from '../audio/score'
import { S1Canada } from './S1Canada'
import { S2Betrayal } from './S2Betrayal'
import { S3End } from './S3End'
import { S4Chickenpox } from './S4Chickenpox'
import { S5Talk } from './S5Talk'
import { S6Declaration } from './S6Declaration'
import { S7Reply } from './S7Reply'
import { S8Final } from './S8Final'

export interface SceneDef {
  id: string
  title: string
  duration: number
  mood: Mood
  Component: ComponentType
}

export const SCENES: SceneDef[] = [
  { id: 'canada', title: 'O Intercâmbio', duration: 20000, mood: 'cold', Component: S1Canada },
  { id: 'traicao', title: 'A Traição', duration: 26000, mood: 'tension', Component: S2Betrayal },
  { id: 'fim', title: 'O Fim', duration: 22500, mood: 'montage', Component: S3End },
  { id: 'catapora', title: 'Catapora', duration: 23500, mood: 'comic', Component: S4Chickenpox },
  { id: 'conversa', title: 'Voltam a se Falar', duration: 23500, mood: 'warm', Component: S5Talk },
  { id: 'declaracao', title: 'A Declaração', duration: 20500, mood: 'rising', Component: S6Declaration },
  { id: 'resposta', title: 'A Resposta', duration: 25000, mood: 'calm', Component: S7Reply },
  { id: 'final', title: 'O Final', duration: 27500, mood: 'finale', Component: S8Final },
]

export const CREDITS_DURATION = 30000
