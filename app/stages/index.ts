import { List } from 'immutable'
import StageConfig from 'types/StageConfig'

const requireStage = (require as any).context('stages', false, /\.json/)
const filenames = List<string>(requireStage.keys())

let defaultStages = filenames
  .map(requireStage)
  .map(StageConfig.fromJS)
  // 按照关卡数字顺序排序
  .sortBy(s => Number(s.name))

if (DEV.TEST_STAGE) {
  defaultStages = defaultStages.push(
    StageConfig.fromJS({
      name: '1',
      custom: true,
      difficulty: 1,
      map: [
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  X  X  X  X  X  X  X  X  ',
        'X  X  X  X  X  Xf Tf Tf X  X  X  X  X  ',
        'X  X  X  X  X  X  E  Tf X  X  X  X  X  ',
      ],
      enemies: ['5*basic'],
    }),
  )
}

export const firstStageName = defaultStages.first().name

export default defaultStages
