module.exports = 

  # Each viz template includes a hidden div filled with image tags for all of the icon 
  # images. The purpose is to cause the browser to cache the icons locally on page load
  # so that there is no visual delay when toggling a button from one state to the next
  # due to downloading the image.

  landingPageTemplate: """
    <div id="landingPagePanel"> 
      <div id="panelLeft">
        <p> {{{ content }}} </p>
      </div>
      <div id="panelRight">
        <img src='IMG/landingPageThumb/carousel3.png' class='mainImageCarousel'>
      </div>
    </div>

    <div class="clearfix"> </div>  

    <div id="thumbnailRow">
      <a id="viz1Anchor" href='#'>
        <div class='thumbnailContainer'>
          <div class="imgContainer viz1Img"> </div>
          <div class='vizLinkBox viz1linkBox'>
            <span> {{ visualization1Link }} </span>
          </div>
        </div>
      </a>
      <a id="viz2Anchor" href='#'>
        <div class='thumbnailContainer'>
          <div class="imgContainer viz2Img"> </div>
          <div class='vizLinkBox viz2linkBox'>
            <span> {{ visualization2Link }} </span>
          </div>
        </div>
      </a>
      <a id="viz3Anchor" href='#'>
        <div class='thumbnailContainer'>
          <div class="imgContainer viz3Img"> </div>
          <div class='vizLinkBox viz3linkBox'>
            <span> {{ visualization3Link }} </span>
          </div>
        </div>
      </a>
      <a id="viz4Anchor" href='#'>
        <div class='thumbnailContainer'>
          <div class="imgContainer viz4Img"> </div>
          <div class='vizLinkBox viz4linkBox'>
            <span> {{ visualization4Link }} </span>
          </div>
        </div>
      </a>
      <div class="clearfix"> </div>  
    </div>
  """

  visualization1Template: """
    <div id="wideVisualizationPanel"> 

      <div id="buttonPanel" class="selectorColumn">
        <div class="mainSelectorSection">  
          <span class="floatedTitleLabel">{{selectOneLabel}}</span>
          <a href='#'>  
            <img src="IMG/large_qmark.svg" class="helpIconButton mainSelectorHelpButton pointerCursor"> 
          </a>
          <div class="clearfix"> </div>  
          <div class="selectorGroup">
            <div id="mainSelector"></div>
            <div class="clearfix"> </div>
          </div>
        </div>
        <div class="unitsSelectorGroup">  
          <span class="floatedTitleLabel">{{selectUnitLabel}}</span>
          <a href='#'>
            <img src="IMG/large_qmark.svg" class="helpIconButton unitSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="unitsSelector"> </div>    
          </div>
        </div>
        <div class="scenarioSelectorGroup">    
          <span class="floatedTitleLabel">{{selectScenarioLabel}}</span>
          <a href='#'>
            <img src="IMG/large_qmark.svg" class="helpIconButton scenarioSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="scenariosSelector"> </div>
          </div>
        </div>
      </div>

      <div id="provincePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectRegionLabel}}</span>
        <div id="provincesSelector">
          <svg id="provinceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="graphPanel" class="wideVisualizationColumn">
        <svg id="graphSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          <style> {{ svgStylesheet }} </style>
            <g id="xAxis"> 
              <g id="xAxisForLabels"> </g>
              <g id="xAxisForTicks"> </g>
            </g>
            <g id="yAxis"> </g>
            <g id="graphGroup">  </g>
          </g>
        </svg>
      </div>
    </div>

    <div class="hidden"> 
      <img src="IMG/main_selection/electricity_selected.png"> 
      <img src="IMG/main_selection/electricity_unselected.png"> 
      <img src="IMG/main_selection/gas_selected.png"> 
      <img src="IMG/main_selection/gas_unselected.png"> 
      <img src="IMG/main_selection/oil_selected.png"> 
      <img src="IMG/main_selection/oil_unselected.png"> 
      <img src="IMG/main_selection/totalDemand_selected.png"> 
      <img src="IMG/main_selection/totalDemand_unselected.png"> 

      <img src="IMG/provinces/colour/AB_Selected.svg">
      <img src="IMG/provinces/colour/BC_Selected.svg">
      <img src="IMG/provinces/colour/MB_Selected.svg">
      <img src="IMG/provinces/colour/NB_Selected.svg">
      <img src="IMG/provinces/colour/NL_Selected.svg">
      <img src="IMG/provinces/colour/NS_Selected.svg">
      <img src="IMG/provinces/colour/NT_Selected.svg">
      <img src="IMG/provinces/colour/NU_Selected.svg">
      <img src="IMG/provinces/colour/ON_Selected.svg">
      <img src="IMG/provinces/colour/PEI_Selected.svg">
      <img src="IMG/provinces/colour/QC_Selected.svg">
      <img src="IMG/provinces/colour/Sask_Selected.svg">
      <img src="IMG/provinces/colour/Yukon_Selected.svg">

      <img src="IMG/provinces/colour/AB_Unselected.svg">
      <img src="IMG/provinces/colour/BC_Unselected.svg">
      <img src="IMG/provinces/colour/MB_Unselected.svg">
      <img src="IMG/provinces/colour/NB_Unselected.svg">
      <img src="IMG/provinces/colour/NL_Unselected.svg">
      <img src="IMG/provinces/colour/NS_Unselected.svg">
      <img src="IMG/provinces/colour/NT_Unselected.svg">
      <img src="IMG/provinces/colour/NU_Unselected.svg">
      <img src="IMG/provinces/colour/ON_Unselected.svg">
      <img src="IMG/provinces/colour/PEI_Unselected.svg">
      <img src="IMG/provinces/colour/QC_Unselected.svg">
      <img src="IMG/provinces/colour/Sask_Unselected.svg">
      <img src="IMG/provinces/colour/Yukon_Unselected.svg">

      <img src="IMG/provinces/DataUnavailable/AB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/BC_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/MB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NL_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NS_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NT_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NU_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/ON_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/PEI_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/QC_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/SK_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/Yukon_Unavailable.svg">
    </div>

  """

  visualization2Template: """
    <div id="wideVisualizationPanel"> 

      <div id="buttonPanel" class="selectorColumn">
        <div class="sectorSelectorGroup">  
          <span class="floatedTitleLabel">{{selectSectorLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton sectorSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="sectorsSelector"> </div>
            <div class="clearfix"> </div>
          </div>
        </div>
        <div class="unitsSelectorGroup">    
          <span class="floatedTitleLabel">{{selectUnitLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton unitSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="unitsSelector"> </div>
          </div>
        </div>
        <div class="scenarioSelectorGroup">    
          <span class="floatedTitleLabel">{{selectScenarioLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton  scenarioSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="scenariosSelector"> </div>
          </div>
        </div>
      </div>

      <div id="provincePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectRegionLabel}}</span>
        <div id="provincesSelector">
          <svg id="provinceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="powerSourcePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectSourceLabel}}</span>
        <div id="powerSourceSelector">
          <svg id="powerSourceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="graphPanel" class="narrowVisualizationColumn">
        <svg id="graphSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          <defs> </defs>
          <style> {{ svgStylesheet }} </style>
          <g id="xAxisGrid"> </g>
          <g id="yAxisGrid"> </g>
          <g id="xAxis"> 
            <g id="xAxisForLabels"> </g>
            <g id="xAxisForTicks"> </g>
          </g>
          <g id="yAxis"> </g>
          <g id="graphGroup"> </g>
        </svg>
      </div>
    </div>

    <div class="hidden"> 
      <img src="IMG/sector/commercial_selected.svg"> 
      <img src="IMG/sector/commercial_unselected.svg"> 
      <img src="IMG/sector/industrial_selected.svg"> 
      <img src="IMG/sector/industrial_unselected.svg"> 
      <img src="IMG/sector/residential_selected.svg"> 
      <img src="IMG/sector/residential_unselected.svg"> 
      <img src="IMG/sector/transport_selected.svg"> 
      <img src="IMG/sector/transport_unselected.svg"> 

      <img src="IMG/sources/electricity_selected.svg"> 
      <img src="IMG/sources/electricity_unselected.svg"> 
      <img src="IMG/sources/oil_products_selected.svg"> 
      <img src="IMG/sources/oil_products_unselected.svg"> 
      <img src="IMG/sources/biomass_selected.svg"> 
      <img src="IMG/sources/biomass_unselected.svg"> 
      <img src="IMG/sources/naturalGas_selected.svg"> 
      <img src="IMG/sources/naturalGas_unselected.svg"> 
      <img src="IMG/sources/coal_selected.svg"> 
      <img src="IMG/sources/coal_unselected.svg"> 
      <img src="IMG/sources/solarWindGeo_selected.svg"> 
      <img src="IMG/sources/solarWindGeo_unselected.svg"> 

      <img src="IMG/sources/unavailable/electricity_unavailable.svg"> 
      <img src="IMG/sources/unavailable/oil_products_unavailable.svg"> 
      <img src="IMG/sources/unavailable/biomass_unavailable.svg"> 
      <img src="IMG/sources/unavailable/naturalGas_unavailable.svg"> 
      <img src="IMG/sources/unavailable/coal_unavailable.svg"> 
      <img src="IMG/sources/unavailable/solarWindGeo_unavailable.svg"> 
    <div>



  """

  visualization3Template: """
    <div id="wideVisualizationPanel"> 

      <div id="buttonPanel" class="selectorColumn">
        <div class="viewBySelectorGroup">  
          <span class="floatedTitleLabel">{{selectViewByLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton viewBySelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="viewBySelector"> </div>
          </div>
        </div>
        <div class="unitsSelectorGroup">    
          <span class="floatedTitleLabel">{{selectUnitLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton unitSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="unitsSelector"> </div>
          </div>
        </div>
        <div class="scenarioSelectorGroup">    
          <span class="floatedTitleLabel">{{selectScenarioLabel}}</span>
          <a href='#'> 
            <img src="IMG/large_qmark.svg" class="helpIconButton scenarioSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="scenariosSelector"> </div>
          </div>
        </div>
      </div>

      <div id="provincePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectRegionLabel}}</span>
        <div id="provincesSelector">
          <svg id="provinceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="powerSourcePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectSourceLabel}}</span>
        <div id="powerSourceSelector">
          <svg id="powerSourceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="graphPanel" class="narrowVisualizationColumn">
        <svg id="graphSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          <style> {{ svgStylesheet }} </style>
          <g id="graphGroup">  </g>
          <g id="timeline"> 
            <g id="timelineAxis"> </g>
            <rect id="timeLineTouch"> </rect>
          </g>
        </svg>
      </div>
    </div>

    <div class="hidden"> 
      <img src="IMG/sources/oil_products_selected.svg"> 
      <img src="IMG/sources/oil_products_unselected.svg"> 
      <img src="IMG/sources/nuclear_selected.svg"> 
      <img src="IMG/sources/nuclear_unselected.svg"> 
      <img src="IMG/sources/biomass_selected.svg"> 
      <img src="IMG/sources/biomass_unselected.svg"> 
      <img src="IMG/sources/naturalGas_selected.svg"> 
      <img src="IMG/sources/naturalGas_unselected.svg"> 
      <img src="IMG/sources/coal_selected.svg"> 
      <img src="IMG/sources/coal_unselected.svg"> 
      <img src="IMG/sources/solarWindGeo_selected.svg"> 
      <img src="IMG/sources/solarWindGeo_unselected.svg"> 
      <img src="IMG/sources/hydro_selected.svg"> 
      <img src="IMG/sources/hydro_unselected.svg"> 

      <img src="IMG/sources/oil_products_selectedR.svg"> 
      <img src="IMG/sources/oil_products_unselectedR.svg"> 
      <img src="IMG/sources/nuclear_selectedR.svg"> 
      <img src="IMG/sources/nuclear_unselectedR.svg"> 
      <img src="IMG/sources/biomass_selectedR.svg"> 
      <img src="IMG/sources/biomass_unselectedR.svg"> 
      <img src="IMG/sources/naturalGas_selectedR.svg"> 
      <img src="IMG/sources/naturalGas_unselectedR.svg"> 
      <img src="IMG/sources/coal_selectedR.svg"> 
      <img src="IMG/sources/coal_unselectedR.svg"> 
      <img src="IMG/sources/solarWindGeo_selectedR.svg"> 
      <img src="IMG/sources/solarWindGeo_unselectedR.svg"> 
      <img src="IMG/sources/hydro_selectedR.svg"> 
      <img src="IMG/sources/hydro_unselectedR.svg"> 

      <img src="IMG/sources/unavailable/hydro_unavailable.svg"> 
      <img src="IMG/sources/unavailable/oil_products_unavailable.svg"> 
      <img src="IMG/sources/unavailable/biomass_unavailable.svg"> 
      <img src="IMG/sources/unavailable/naturalGas_unavailable.svg"> 
      <img src="IMG/sources/unavailable/coal_unavailable.svg"> 
      <img src="IMG/sources/unavailable/solarWindGeo_unavailable.svg"> 
      <img src="IMG/sources/unavailable/nuclear_unavailable.svg"> 

      <img src="IMG/provinces/colour/AB_Selected.svg">
      <img src="IMG/provinces/colour/BC_Selected.svg">
      <img src="IMG/provinces/colour/MB_Selected.svg">
      <img src="IMG/provinces/colour/NB_Selected.svg">
      <img src="IMG/provinces/colour/NL_Selected.svg">
      <img src="IMG/provinces/colour/NS_Selected.svg">
      <img src="IMG/provinces/colour/NT_Selected.svg">
      <img src="IMG/provinces/colour/NU_Selected.svg">
      <img src="IMG/provinces/colour/ON_Selected.svg">
      <img src="IMG/provinces/colour/PEI_Selected.svg">
      <img src="IMG/provinces/colour/QC_Selected.svg">
      <img src="IMG/provinces/colour/Sask_Selected.svg">
      <img src="IMG/provinces/colour/Yukon_Selected.svg">

      <img src="IMG/provinces/colour/AB_Unselected.svg">
      <img src="IMG/provinces/colour/BC_Unselected.svg">
      <img src="IMG/provinces/colour/MB_Unselected.svg">
      <img src="IMG/provinces/colour/NB_Unselected.svg">
      <img src="IMG/provinces/colour/NL_Unselected.svg">
      <img src="IMG/provinces/colour/NS_Unselected.svg">
      <img src="IMG/provinces/colour/NT_Unselected.svg">
      <img src="IMG/provinces/colour/NU_Unselected.svg">
      <img src="IMG/provinces/colour/ON_Unselected.svg">
      <img src="IMG/provinces/colour/PEI_Unselected.svg">
      <img src="IMG/provinces/colour/QC_Unselected.svg">
      <img src="IMG/provinces/colour/Sask_Unselected.svg">
      <img src="IMG/provinces/colour/Yukon_Unselected.svg">

      <img src="IMG/provinces/DataUnavailable/AB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/BC_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/MB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NB_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NL_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NS_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NT_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/NU_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/ON_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/PEI_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/QC_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/SK_Unavailable.svg">
      <img src="IMG/provinces/DataUnavailable/Yukon_Unavailable.svg">


      <img src="IMG/provinces/radio/all_allSelectedR.svg">
      <img src="IMG/provinces/radio/all_someSelectedR.svg">
      <img src="IMG/provinces/radio/all_noneSelectedR.svg">
      
      <img src="IMG/provinces/french/tous_AllSelectedR.svg">
      <img src="IMG/provinces/french/tous_someSelectedR.svg">
      <img src="IMG/provinces/french/tous_noneSelectedR.svg">

      <img src="IMG/provinces/radio/AB_SelectedR.svg">
      <img src="IMG/provinces/radio/BC_SelectedR.svg">
      <img src="IMG/provinces/radio/MB_SelectedR.svg">
      <img src="IMG/provinces/radio/NB_SelectedR.svg">
      <img src="IMG/provinces/radio/NL_SelectedR.svg">
      <img src="IMG/provinces/radio/NS_SelectedR.svg">
      <img src="IMG/provinces/radio/NT_SelectedR.svg">
      <img src="IMG/provinces/radio/NU_SelectedR.svg">
      <img src="IMG/provinces/radio/ON_SelectedR.svg">
      <img src="IMG/provinces/radio/PEI_SelectedR.svg">
      <img src="IMG/provinces/radio/QC_SelectedR.svg">
      <img src="IMG/provinces/radio/Sask_SelectedR.svg">
      <img src="IMG/provinces/radio/Yukon_SelectedR.svg">
      
      <img src="IMG/provinces/radio/AB_UnselectedR.svg">
      <img src="IMG/provinces/radio/BC_UnselectedR.svg">
      <img src="IMG/provinces/radio/MB_UnselectedR.svg">
      <img src="IMG/provinces/radio/NB_UnselectedR.svg">
      <img src="IMG/provinces/radio/NL_UnselectedR.svg">
      <img src="IMG/provinces/radio/NS_UnselectedR.svg">
      <img src="IMG/provinces/radio/NT_UnselectedR.svg">
      <img src="IMG/provinces/radio/NU_UnselectedR.svg">
      <img src="IMG/provinces/radio/ON_UnselectedR.svg">
      <img src="IMG/provinces/radio/PEI_UnselectedR.svg">
      <img src="IMG/provinces/radio/QC_UnselectedR.svg">
      <img src="IMG/provinces/radio/Sask_UnselectedR.svg">
      <img src="IMG/provinces/radio/Yukon_UnselectedR.svg">


    <div>
  """
  # TODO: should we also include the 'data unavailable' icons here?


  visualization4Template: """
    <div id="wideVisualizationPanel"> 

      <div id="buttonPanel" class="selectorColumn">
        <div class="mainSelectorSection">    
          <span class="floatedTitleLabel">{{selectOneLabel}}</span>
          <a href='#''>
            <img src="IMG/large_qmark.svg" class="helpIconButton mainSelectorHelpButton pointerCursor"> 
          </a>
          <div class="clearfix"> </div>
          <div class="selectorGroup">
            <div id="mainSelector"> </div>
            <div class="clearfix"> </div>
          </div>
        </div>
        <div class="unitsSelectorGroup">    
          <span class="floatedTitleLabel">{{selectUnitLabel}}</span>
          <a href='#'>  
            <img src="IMG/large_qmark.svg" class="helpIconButton unitSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="unitsSelector"> </div>
          </div>
        </div>
        <div class="scenarioSelectorGroup">  
          <span class="floatedTitleLabel">{{selectScenarioLabel}}</span>
          <a href='#'>
            <img src="IMG/large_qmark.svg" class="helpIconButton scenarioSelectorHelpButton pointerCursor"> 
          </a>
          <div class="selectorGroup">
            <div id="scenariosSelector"> </div>
          </div>
        </div>
      </div>

      <div id="provincePanel" class="smallSelectorColumn">
        <span class="titleLabel textCentre">{{selectRegionLabel}}</span>
        <div id="provincesSelector">
          <svg id="provinceMenuSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          </svg>
        </div>
      </div>
      <div id="graphPanel" class="wideVisualizationColumn">
        <svg id="graphSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
          <style> {{ svgStylesheet }} </style>
          <g id="graphGroup"> 
            <defs> </defs>
            <g id="xAxisGrid"> </g>
            <g id="yAxisGrid"> </g>
            <g id="xAxis"> </g>
            <g id="yAxis"> </g>
            <g id="areasAndLinesGroup"> </g>
            <g id="referenceCaseLineGroup"> </g>
          </g>
        </svg>
      </div>
    </div>

    <div class="hidden"> 
      <img src="IMG/main_selection/electricity_selected.png"> 
      <img src="IMG/main_selection/electricity_unselected.png"> 
      <img src="IMG/main_selection/gas_selected.png"> 
      <img src="IMG/main_selection/gas_unselected.png"> 
      <img src="IMG/main_selection/oil_selected.png"> 
      <img src="IMG/main_selection/oil_unselected.png"> 
      <img src="IMG/main_selection/totalDemand_selected.png"> 
      <img src="IMG/main_selection/totalDemand_unselected.png"> 
    </div>
  """


  bottomNavBarTemplate: """
    <a href="#" id="aboutLinkAnchor">
      <div id="aboutLink" class="leftItem">{{ aboutLink }}</div>
    </a>
    <a href="{{ methodologyLinkUrl }}" target="_blank" id="methodologyLinkAnchor">
      <div class="leftItem">{{ methodologyLinkText }}</div>
    </a>

    <a href="#" id="twitterLinkAnchor">
      <div class="twitterItem">
        <img src='IMG/social_media/twitter.svg'>
      </div>
    </a>
    <a href="#" id="linkedInLinkAnchor">
      <div class="linkedinItem">
        <img src='IMG/social_media/linkedin.svg'>
      </div>
    </a>
    <a href="#" id="emailLinkAnchor">
      <div class="emailItem"> 
        <img src='IMG/social_media/email.svg'>
      </div>
    </a>
    <div class="rightItem">{{ shareLabel }}</div>

    <div class="rightItem spacer"></div>

    <div class="rightItem" id="dataDownloadLinkAnchor">  
      <a id='dataDownloadLink' data-ajax="false" download='vizData.zip' href='CSV/vizData.zip'>
        {{ dataDownloadLink }}
      </a>
    </div>
    <a id='imageDownloadLink' href="#" id="imageDownloadLinkAnchor">
      <div class="rightItem">{{ imageDownloadLink }}</div>
    </a>

  """

  aboutThisProjectTemplate: """
    <div class="modalHeader"> 
      <img class="closeButton" src="IMG/close_button.svg"/> 
      <div>
        <h5> {{ aboutTitle }} </h5>
      </div>
      <div class="clearfix"> </div>
    </div>
    <div class="modalContent"> {{{ aboutContent }}} </div>
  """

  imageDownloadTemplate: """
    <div class="modalHeader"> 
      <img class="closeButton" src="IMG/close_button.svg"/> 
      
      <div>
        <h5> {{ imageDownloadHeader }} </h5>
      </div>
      <div class="clearfix"> </div>
    </div>

    <div class="modalContent">
      <div id="renderedImageContainer"> </div>
      <p> {{ imageDownloadInstructions }} </p>
    </div>

  """

  questionMarkPopoverTemplate:
    """
    <div class="modalHeader"> 
      <img class="closeButton" src="IMG/close_button.svg"/> 

      <h5 class="{{visClass}}"> {{ popUpTitle}} </h5>

      <div class="clearfix"> </div>
    </div>
    <div class="modalContent"> {{{ popUpContent }}} </div>
  """

  svgStylesheet: """
    text {
      font-family: Avenir Next Demi Condensed, PT Sans Narrow;
      font-size: 16px;
    } 
  """

  howToPopoverContent: """
    <div class="modalContent">

      <div class="howToImageContainer">
        <img src="{{ imageAUrl }}">
      </div> 

      <div class="howToImageContainer hidden">
        <img src="{{ imageBUrl }}">
      </div> 
    
      <div class="howToNavigation">
        <button class="howToBackButton" type="button"> 
          <p> Placeholder </p>
          <img>
        </button>
        <button class="howToForwardButton" type="button" disabled> 
          <p> Placeholder </p>
          <img>
        </button>
      </div>

    </div>
  """




