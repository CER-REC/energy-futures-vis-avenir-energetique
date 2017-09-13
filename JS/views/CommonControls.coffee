Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'


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
    oct2017 =
      label: Tr.datasetSelector.oct2017Button[app.language]
      dataset: 'oct2017'
      title: Tr.selectorTooltip.datasetSelector.oct2017[app.language]
      class:
        if config.dataset == 'oct2017'
          'vizButton selected'
        else
          'vizButton'
      ariaLabel:
        if config.dataset == 'oct2017'
          Tr.altText.dataset.oct2017Selected[app.language]
        else
          Tr.altText.dataset.oct2017Unselected[app.language]

    [oct2017, oct2016, jan2016]


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

    # TODO: not all visualizations have a 'main selection'.
    # This should be named differently.
    switch config.mainSelection
      when 'energyDemand'
        [petajoules, kilobarrelEquivalents]
      when 'electricityGeneration'
        [petajoules, gigawattHours, kilobarrelEquivalents]
      when 'oilProduction'
        [kilobarrels, thousandCubicMetres]
      when 'gasProduction'
        [cubicFeet, millionCubicMetres]


  scenariosSelectionData: (config, app) ->
    reference =
      title: Tr.selectorTooltip.scenarioSelector.referenceButton[app.language]
      label: Tr.scenarioSelector.referenceButton[app.language]
      scenarioName: 'reference'
      singleSelectClass:
        if config.scenario == 'reference'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'reference'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'reference'
          'vizButton selected reference'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'reference'
          'vizButton reference'
      ariaLabel:
        if config.scenario == 'reference' or config.scenarios?.includes 'reference'
          Tr.altText.scenario.referenceSelected[app.language]
        else
          Tr.altText.scenario.referenceUnselected[app.language]
      colour: '#999999'
    constrained =
      title: Tr.selectorTooltip.scenarioSelector.constrainedButton[app.language]
      label: Tr.scenarioSelector.constrainedButton[app.language]
      scenarioName: 'constrained'
      singleSelectClass:
        if config.scenario == 'constrained'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'constrained'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'constrained'
          'vizButton selected constrained'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'constrained'
          'vizButton constrained'
      ariaLabel:
        if config.scenario == 'constrained' or config.scenarios?.includes 'constrained'
          Tr.altText.scenario.constrainedSelected[app.language]
        else
          Tr.altText.scenario.constrainedUnselected[app.language]
      colour: '#41B6C4'
    high =
      title: Tr.selectorTooltip.scenarioSelector.highPriceButton[app.language]
      label: Tr.scenarioSelector.highPriceButton[app.language]
      scenarioName: 'high'
      singleSelectClass:
        if config.scenario == 'high'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'high'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'high'
          'vizButton selected high'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'high'
          'vizButton high'
      ariaLabel:
        if config.scenario == 'high' or config.scenarios?.includes 'high'
          Tr.altText.scenario.highSelected[app.language]
        else
          Tr.altText.scenario.highUnselected[app.language]
      colour: '#0C2C84'
    low =
      title: Tr.selectorTooltip.scenarioSelector.lowPriceButton[app.language]
      label: Tr.scenarioSelector.lowPriceButton[app.language]
      scenarioName: 'low'
      singleSelectClass:
        if config.scenario == 'low'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'low'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'low'
          'vizButton selected low'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'low'
          'vizButton low'
      ariaLabel:
        if config.scenario == 'low' or config.scenarios?.includes 'low'
          Tr.altText.scenario.lowSelected[app.language]
        else
          Tr.altText.scenario.lowUnselected[app.language]
      colour: '#7FCDBB'
    highLng =
      title: Tr.selectorTooltip.scenarioSelector.highLngButton[app.language]
      label: Tr.scenarioSelector.highLngButton[app.language]
      scenarioName: 'highLng'
      singleSelectClass:
        if config.scenario == 'highLng'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'highLng'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'highLng'
          'vizButton selected highLng'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'highLng'
          'vizButton highLng'
      ariaLabel:
        if config.scenario == 'highLng' or config.scenarios?.includes 'highLng'
          Tr.altText.scenario.highLngSelected[app.language]
        else
          Tr.altText.scenario.highLngUnselected[app.language]
      colour: '#41B6C4'
    noLng =
      title: Tr.selectorTooltip.scenarioSelector.noLngButton[app.language]
      label: Tr.scenarioSelector.noLngButton[app.language]
      scenarioName: 'noLng'
      singleSelectClass:
        if config.scenario == 'noLng'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'noLng'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'noLng'
          'vizButton selected noLng'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'noLng'
          'vizButton noLng'
      ariaLabel:
        if config.scenario == 'noLng' or config.scenarios?.includes 'noLng'
          Tr.altText.scenario.noLngSelected[app.language]
        else
          Tr.altText.scenario.noLngUnselected[app.language]
      colour: '#C7E9B4'
    technology =
      title: Tr.selectorTooltip.scenarioSelector.technologyButton[app.language]
      label: Tr.scenarioSelector.technologyButton[app.language]
      scenarioName: 'technology'
      singleSelectClass:
        if config.scenario == 'technology'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'technology'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'technology'
          'vizButton selected technology'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'technology'
          'vizButton technology'
      ariaLabel:
        if config.scenario == 'technology' or config.scenarios?.includes 'technology'
          Tr.altText.scenario.technologySelected[app.language]
        else
          Tr.altText.scenario.technologyUnselected[app.language]
      colour: '#0C2C84'
    htc =
      title: Tr.selectorTooltip.scenarioSelector.htcButton[app.language]
      label: Tr.scenarioSelector.htcButton[app.language]
      scenarioName: 'htc'
      singleSelectClass:
        if config.scenario == 'htc'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'htc'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'htc'
          'vizButton selected htc'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'htc'
          'vizButton htc'
      ariaLabel:
        if config.scenario == 'htc' or config.scenarios?.includes 'htc'
          Tr.altText.scenario.htcSelected[app.language]
        else
          Tr.altText.scenario.htcUnselected[app.language]
      colour: '#0C2C84'
    hcp =
      title: Tr.selectorTooltip.scenarioSelector.hcpButton[app.language]
      label: Tr.scenarioSelector.hcpButton[app.language]
      scenarioName: 'hcp'
      singleSelectClass:
        if config.scenario == 'hcp'
          'vizButton selected'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'hcp'
          'vizButton'
      multipleSelectClass:
        if config.scenarios?.includes 'hcp'
          'vizButton selected hcp'
        else if Constants.datasetDefinitions[config.dataset].scenarios.includes 'hcp'
          'vizButton hcp'
      ariaLabel:
        if config.scenario == 'hcp' or config.scenarios?.includes 'hcp'
          Tr.altText.scenario.hcpSelected[app.language]
        else
          Tr.altText.scenario.hcpUnselected[app.language]
      colour: '#7FCDBB'

    # TODO: not all visualizations have a 'main selection'.
    # This should be named differently.

    switch config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        if config.dataset == 'jan2016'
          [reference, high, highLng, constrained, low, noLng]
        else if config.dataset == 'oct2016'
          [reference, high, low]
        else if config.dataset == 'oct2017'
          [reference, technology, hcp]
      when 'oilProduction'
        if config.dataset == 'jan2016'
          [reference, high, constrained, low]
        else if config.dataset == 'oct2016'
          [reference, high, low]
        else if config.dataset == 'oct2017'
          [reference, htc, hcp]
      when 'gasProduction'
        if config.dataset == 'jan2016'
          [reference, high, highLng, low, noLng]
        else if config.dataset == 'oct2016'
          [reference, high, low]
        else if config.dataset == 'oct2017'
          [reference, technology, hcp]
      # This is the case when the scenarios list is requested by viz5. Because
      # viz5 config does not contain a main selection and since we currently
      # need to return the full list of scenarios, we are defaulting to return all
      # the scenarios for each of the datasets.
      else
        if config.dataset == 'jan2016'
          [reference, high, highLng, constrained, low, noLng]
        else if config.dataset == 'oct2016'
          [reference, high, low]
        else if config.dataset == 'oct2017'
          [reference, technology, hcp]

module.exports = CommonControls