Tr = require '../TranslationTable.coffee'


CommonControls =

  datasetSelectionData: (config, app) ->
    jan2016 =
      label: Tr.datasetSelector.jan2016Button[app.language]
      dataset: 'jan2016'
      title: Tr.selectorTooltip.datasetSelector.jan2016[app.language]
      class:
        if config.dataset == 'jan2016'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.dataset == 'jan2016'
          Tr.altText.dataset.jan2016Selected[app.language]
        else
          Tr.altText.dataset.jan2016Unselected[app.language]
    oct2016 =
      label: Tr.datasetSelector.oct2016Button[app.language]
      dataset: 'oct2016'
      title: Tr.selectorTooltip.datasetSelector.oct2016[app.language]
      class:
        if config.dataset == 'oct2016'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.dataset == 'oct2016'
          Tr.altText.dataset.oct2016Selected[app.language]
        else
          Tr.altText.dataset.oct2016Unselected[app.language]

    [oct2016, jan2016]


  mainSelectionData: (config, app) ->
    [
      {
        title: Tr.selectorTooltip.mainSelector.totalDemandButton[app.language]
        label: Tr.mainSelector.totalDemandButton[app.language]
        image:
          if config.mainSelection == 'energyDemand'
            'IMG/main_selection/totalDemand_selected.png'
          else
            'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
        altText:
          if config.mainSelection == 'energyDemand'
            Tr.altText.totalDemand_selected[app.language]
          else
            Tr.altText.totalDemand_unselected[app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.electricityGenerationButton[app.language]
        label: Tr.mainSelector.electricityGenerationButton[app.language]
        image:
          if config.mainSelection == 'electricityGeneration'
            'IMG/main_selection/electricity_selected.png'
          else
            'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
        altText:
          if config.mainSelection == 'electricityGeneration'
            Tr.altText.electricity_selected[app.language]
          else
            Tr.altText.electricity_unselected[app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.oilProductionButton[app.language]
        label: Tr.mainSelector.oilProductionButton[app.language]
        image:
          if config.mainSelection == 'oilProduction'
            'IMG/main_selection/oil_selected.png'
          else
            'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
        altText:
          if config.mainSelection == 'oilProduction'
            Tr.altText.oil_selected[app.language]
          else
            Tr.altText.oil_unselected[app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.gasProductionButton[app.language]
        label: Tr.mainSelector.gasProductionButton[app.language]
        image:
          if config.mainSelection == 'gasProduction'
            'IMG/main_selection/gas_selected.png'
          else
            'IMG/main_selection/gas_unselected.png'
        selectorName: 'gasProduction'
        altText:
          if config.mainSelection == 'gasProduction'
            Tr.altText.gas_selected[app.language]
          else
            Tr.altText.gas_unselected[app.language]
      }
    ]


  unitSelectionData: (config, app) ->
    petajoules =
      title: Tr.selectorTooltip.unitSelector.petajoulesButton[app.language]
      label: Tr.unitSelector.petajoulesButton[app.language]
      unitName: 'petajoules'
      class:
        if config.unit == 'petajoules'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'petajoules'
          Tr.altText.unit.petajoulesSelected[app.language]
        else
          Tr.altText.unit.petajoulesUnselected[app.language]

    kilobarrelEquivalents =
      title: Tr.selectorTooltip.unitSelector.kilobarrelEquivalentsButton[app.language]
      label: Tr.unitSelector.kilobarrelEquivalentsButton[app.language]
      unitName: 'kilobarrelEquivalents'
      class:
        if config.unit == 'kilobarrelEquivalents'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'kilobarrelEquivalents'
          Tr.altText.unit.kilobarrelEquivalentsSelected[app.language]
        else
          Tr.altText.unit.kilobarrelEquivalentsUnselected[app.language]

    gigawattHours =
      title: Tr.selectorTooltip.unitSelector.gigawattHourButton[app.language]
      label: Tr.unitSelector.gigawattHourButton[app.language]
      unitName: 'gigawattHours'
      class:
        if config.unit == 'gigawattHours'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'gigawattHours'
          Tr.altText.unit.gigawattHoursSelected[app.language]
        else
          Tr.altText.unit.gigawattHoursUnselected[app.language]

    thousandCubicMetres =
      title: Tr.selectorTooltip.unitSelector.thousandCubicMetresButton[app.language]
      label: Tr.unitSelector.thousandCubicMetresButton[app.language]
      unitName: 'thousandCubicMetres'
      class:
        if config.unit == 'thousandCubicMetres'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'thousandCubicMetres'
          Tr.altText.unit.thousandCubicMetresSelected[app.language]
        else
          Tr.altText.unit.thousandCubicMetresUnselected[app.language]

    millionCubicMetres =
      title: Tr.selectorTooltip.unitSelector.millionCubicMetresButton[app.language]
      label: Tr.unitSelector.millionCubicMetresButton[app.language]
      unitName: 'millionCubicMetres'
      class:
        if config.unit == 'millionCubicMetres'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'millionCubicMetres'
          Tr.altText.unit.millionCubicMetresSelected[app.language]
        else
          Tr.altText.unit.millionCubicMetresUnselected[app.language]

    kilobarrels =
      title: Tr.selectorTooltip.unitSelector.kilobarrelsButton[app.language]
      label: Tr.unitSelector.kilobarrelsButton[app.language]
      unitName: 'kilobarrels'
      class:
        if config.unit == 'kilobarrels'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'kilobarrels'
          Tr.altText.unit.kilobarrelsSelected[app.language]
        else
          Tr.altText.unit.kilobarrelsUnselected[app.language]

    cubicFeet =
      title: Tr.selectorTooltip.unitSelector.cubicFeetButton[app.language]
      label: Tr.unitSelector.cubicFeetButton[app.language]
      unitName: 'cubicFeet'
      class:
        if config.unit == 'cubicFeet'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.unit == 'cubicFeet'
          Tr.altText.unit.cubicFeetSelected[app.language]
        else
          Tr.altText.unit.cubicFeetUnselected[app.language]

    switch config.mainSelection
      when 'energyDemand'
        [petajoules, kilobarrelEquivalents]
      when 'electricityGeneration'
        [petajoules, gigawattHours, kilobarrelEquivalents]
      when 'oilProduction'
        [kilobarrels, thousandCubicMetres]
      when 'gasProduction'
        [cubicFeet, millionCubicMetres]


module.exports = CommonControls