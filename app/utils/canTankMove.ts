import { List, Map } from 'immutable'
import { asRect, isInField, testCollide } from 'utils/common'
import { BLOCK_SIZE } from 'utils/constants'
import { EagleRecord, State, TankRecord, TanksMap } from 'types'
import IndexHelper from 'utils/IndexHelper'

function isTankCollidedWithEagle(eagle: EagleRecord, tankTarget: Rect, threshhold: number) {
  const eagleRect = {
    x: eagle.x,
    y: eagle.y,
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
  }
  return testCollide(eagleRect, tankTarget, threshhold)
}

function isTankCollidedWithBricks(bricks: List<boolean>, tankTarget: Rect, threshhold: number) {
  for (const t of IndexHelper.iter('brick', tankTarget)) {
    if (bricks.get(t)) {
      const subject = IndexHelper.getRect('brick', t)
      // 因为要考虑threshhold, 所以仍然要调用testCollide来判断是否相撞
      if (testCollide(subject, tankTarget, threshhold)) {
        return true
      }
    }
  }
  return false
}

function isTankCollidedWithSteels(steels: List<boolean>, tankTarget: Rect, threshhold: number) {
  for (const t of IndexHelper.iter('steel', tankTarget)) {
    if (steels.get(t)) {
      const subject = IndexHelper.getRect('steel', t)
      // 因为要考虑threshhold, 所以仍然要调用testCollide来判断是否相撞
      if (testCollide(subject, tankTarget, threshhold)) {
        return true
      }
    }
  }
  return false
}

function isTankCollidedWithRivers(rivers: List<boolean>, tankTarget: Rect, threshhold: number) {
  for (const t of IndexHelper.iter('river', tankTarget)) {
    if (rivers.get(t)) {
      const subject = IndexHelper.getRect('river', t)
      // 因为要考虑threshhold, 所以仍然要调用testCollide来判断是否相撞
      if (testCollide(subject, tankTarget, threshhold)) {
        return true
      }
    }
  }
  return false
}

function isTankCollidedWithRestrictedAreas(
  areas: Map<AreaId, Rect>,
  tankTarget: Rect,
  threshold: number,
) {
  return areas.some(subject => testCollide(subject, tankTarget, threshold))
}

function isTankCollidedWithOtherTanks(
  activeTanks: TanksMap,
  tank: TankRecord,
  tankTarget: Rect,
  threshhold: number,
) {
  // 判断坦克与其他坦克是否相撞
  for (const otherTank of activeTanks.values()) {
    if (tank.tankId === otherTank.tankId) {
      continue
    }
    const subject = asRect(otherTank)
    if (testCollide(subject, tankTarget, threshhold)) {
      return true
    }
  }
  return false
}

export default function canTankMove(state: State, tank: TankRecord, threshhold = -0.01) {
  const { tanks, map: { bricks, steels, rivers, eagle, restrictedAreas } } = state
  const tankRect = asRect(tank)

  // 判断是否位于战场内
  if (!isInField(tankRect)) {
    return false
  }

  // 判断是否与地形相碰撞
  if (isTankCollidedWithEagle(eagle, tankRect, threshhold)) {
    return false
  }
  if (isTankCollidedWithBricks(bricks, tankRect, threshhold)) {
    return false
  }
  if (isTankCollidedWithSteels(steels, tankRect, threshhold)) {
    return false
  }
  if (isTankCollidedWithRivers(rivers, tankRect, threshhold)) {
    return false
  }

  // 判断是否与保留区域有碰撞
  if (isTankCollidedWithRestrictedAreas(restrictedAreas, tankRect, threshhold)) {
    return false
  }

  // 判断是否与其他坦克相碰撞
  const activeTanks = tanks.filter(t => t.active)
  if (isTankCollidedWithOtherTanks(activeTanks, tank, tankRect, threshhold)) {
    return false
  }

  // 与其他物品都没有相撞, 则表示可以进行移动
  return true
}
