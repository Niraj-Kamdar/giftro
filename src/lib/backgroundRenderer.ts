import { type BackgroundType } from './types'
import {
  initParticles,
  updateParticles,
  renderParticleBackground,
  initMatrixColumns,
  updateMatrixColumns,
  renderMatrixBackground,
  initGameOfLifeGrid,
  updateGameOfLife,
  renderGameOfLifeBackground,
  renderPlainBackground,
} from '../components/backgrounds'

export interface BackgroundState {
  type: BackgroundType
  particles?: ReturnType<typeof initParticles>
  matrixColumns?: ReturnType<typeof initMatrixColumns>
  gameOfLifeGrid?: boolean[][]
  frame: number
}

export function createBackgroundState(
  type: BackgroundType,
  width: number,
  height: number
): BackgroundState {
  const state: BackgroundState = { type, frame: 0 }

  switch (type) {
    case 'particle':
      state.particles = initParticles(width, height)
      break
    case 'matrix':
      state.matrixColumns = initMatrixColumns(width, height)
      break
    case 'gameoflife':
      state.gameOfLifeGrid = initGameOfLifeGrid(
        Math.ceil(width / 8),
        Math.ceil(height / 8)
      )
      break
  }

  return state
}

export function updateBackgroundState(
  state: BackgroundState,
  width: number,
  height: number
): BackgroundState {
  const newState = { ...state, frame: state.frame + 1 }

  switch (state.type) {
    case 'particle':
      if (newState.particles) {
        updateParticles(newState.particles, width, height)
      }
      break
    case 'matrix':
      if (newState.matrixColumns) {
        updateMatrixColumns(newState.matrixColumns, height)
      }
      break
    case 'gameoflife':
      // Update every 5 frames
      if (newState.gameOfLifeGrid && newState.frame % 5 === 0) {
        newState.gameOfLifeGrid = updateGameOfLife(
          newState.gameOfLifeGrid,
          Math.ceil(width / 8),
          Math.ceil(height / 8)
        )
      }
      break
  }

  return newState
}

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  state: BackgroundState,
  width: number,
  height: number,
  color: string // hex color
) {
  switch (state.type) {
    case 'particle':
      if (state.particles) {
        renderParticleBackground(ctx, width, height, color, state.particles, state.frame)
      }
      break
    case 'matrix':
      if (state.matrixColumns) {
        renderMatrixBackground(ctx, width, height, color, state.matrixColumns)
      }
      break
    case 'gameoflife':
      if (state.gameOfLifeGrid) {
        renderGameOfLifeBackground(ctx, width, height, color, state.gameOfLifeGrid, 8)
      }
      break
    case 'plain':
    default:
      renderPlainBackground(ctx, width, height, color)
      break
  }
}
