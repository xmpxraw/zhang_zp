export const branches = [
  {
    key: 'qingxin',
    title: '张庆新支',
    group: 'main',
    gens: ['廿一世', '廿二世', '廿三世', '廿四世'],
    root: {
      name: '张庆新', yr: '1936–1996',
      spouse: { name: '曾全英', yr: '1939' },
      children: [
        {
          name: '张文辉', yr: '1957',
          spouse: { name: '王畅珍', yr: '1966' },
          children: [
            { name: '张裕强', yr: '1988' },
            {
              name: '张裕雄', yr: '1990',
              spouse: { name: '戴友红', yr: '1989' },
              children: [
                { name: '张浩楠', yr: '2020' },
                { name: '张浩宇', yr: '2022' }
              ]
            }
          ]
        },
        {
          name: '张清飞', yr: '1962',
          spouse: { name: '廖小利', yr: '1971' },
          children: [
            {
              name: '张裕文', yr: '1990',
              spouse: { name: '黄宝迷', yr: '1990' },
              children: [
                { name: '张圆圆', yr: '2011' },
                { name: '张圆亮', yr: '2015' }
              ]
            },
            {
              name: '张裕良', yr: '1992',
              spouse: { name: '伍慈媚', yr: '1993' },
              children: [{ name: '张铭灏', yr: '2025' }]
            }
          ]
        },
        {
          name: '张远辉', yr: '1965',
          spouse: { name: '彭梅方', yr: '1970' },
          children: [
            { name: '张裕华', yr: '1990' },
            {
              name: '张裕明', yr: '1991',
              spouse: { name: '杨智霞', yr: '1992' },
              children: [{ name: '张青禾', yr: '2022' }]
            }
          ]
        },
        {
          name: '张远华', yr: '1967',
          spouse: { name: '林月爱', yr: '1972' },
          children: [
            { name: '张裕丹', yr: '1991' },
            { name: '张裕婷', yr: '1993' },
            { name: '张裕通', yr: '1994' }
          ]
        },
        {
          name: '张远清', yr: '1969',
          spouse: { name: '曾思娟', yr: '1971' },
          children: [
            { name: '张裕玲', yr: '1992' },
            {
              name: '张裕志', yr: '1993',
              spouse: { name: '陈靖仪', yr: '1995' },
              children: [
                { name: '张乐源', yr: '2025' },
                { name: '张欢桐', yr: '2026' }
              ]
            }
          ]
        },
        { name: '张小香', yr: '1971' }
      ]
    }
  },
  {
    key: 'hanxian',
    title: '张汉贤支',
    group: 'a',
    gens: ['廿二世', '廿三世', '廿四世'],
    root: {
      name: '张汉贤', yr: '1919–2007',
      spouse: { name: '王炎招', yr: '1932–2007' },
      children: [
        { name: '张桂英', yr: '1960' },
        {
          name: '张志标', yr: '1963',
          spouse: { name: '彭新梅', yr: '1962' },
          children: [{ name: '张玲', yr: '1987' }]
        },
        { name: '张小英', yr: '1967' },
        {
          name: '张志东', yr: '1969',
          spouse: { name: '饶小瑜', yr: '1974' },
          children: [{ name: '张逸', yr: '2002' }]
        }
      ]
    }
  },
  {
    key: 'qunlin',
    title: '张群林支',
    group: 'a',
    gens: ['廿三世', '廿四世'],
    root: {
      name: '张群林', yr: '1968',
      spouse: { name: '彭波', yr: '1979' },
      children: [{ name: '张楚崎', yr: '2004' }]
    }
  },
  {
    key: 'wenshu',
    title: '张文枢支',
    group: 'b',
    gens: ['廿三世', '廿四世', '廿五世'],
    root: {
      name: '张文枢', yr: '1931–2007', yrFull: '1931.01.14–2007.03.15',
      spouse: { name: '王荣娣', yr: '1933–2022', yrFull: '1933.02.27–2022.10' },
      children: [
        {
          name: '张伟良', yr: '1953–2012', yrFull: '1953.10.25–2012.08',
          spouse: { name: '丘思萍', yr: '1959.03.30' },
          children: [
            { name: '张海彬', yr: '1990.10.16' },
            { name: '张巧玉' },
            { name: '张仕兰' },
            { name: '张利兰' },
            { name: '张美兰' }
          ]
        },
        {
          name: '张伟渊', yr: '1956.09.03',
          spouse: { name: '周美英', yr: '1961.03.19' },
          children: [
            { name: '张幸兰' },
            { name: '张云彬', yr: '1993.08.16' }
          ]
        },
        {
          name: '张伟炎', yr: '1965.02.28',
          spouse: { name: '罗新兰', yr: '1968.07.28' },
          children: [
            { name: '张兴彬', yr: '1993.08.07' },
            { name: '张兴芳' },
            { name: '张梅芳' }
          ]
        },
        {
          name: '张伟龙', yr: '1970.06.10',
          spouse: { name: '蓝仕红', yr: '1973.04.30' },
          children: [
            { name: '张盛彬', yr: '2003.10.21' },
            { name: '张柳清' }
          ]
        },
        { name: '张利珍' },
        { name: '张利英' },
        { name: '张红珍' }
      ]
    }
  }
]

export const groups = [
  { id: 'main', label: '庆新公下' },
  { id: 'a', label: '旁支' },
  { id: 'b', label: '文枢支' }
]

export const allBranchesOption = { key: 'all', title: '全部' }
