# Redux

Template for what data persists across sessions in the visualization:

<pre>
{

    selection : {
      feature: string,
      subFeature: string,
      company: string,
      project: string,
      condition: string,
    },

    search: {
      included: [string],
      excluded: [string],
      findAny: boolean,
      projectStatus: [string],
      projectYear: {
          start: number,
          end: number,
      },
    },

    chartIndicatorPositon: {
      bubble: string,
      stream: number,
    },

    browseBy: string,
    expandedDetailView: boolean,

}
</pre>

