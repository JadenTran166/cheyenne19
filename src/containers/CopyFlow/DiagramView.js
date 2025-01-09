import { Box, makeStyles } from '@material-ui/core';
import axiosService from 'config/axiosService';
import { useCenteredTree } from 'hooks/useCenteredTree';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import defaultImg from '../../assets/img/default_img.png';
import TreeNode from './TreeNode';
import { createDiagramData } from './utils';

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    width: '100%',
    height: '70vh',
    '& .node_link': {
      stroke: `${theme.palette.primary.main}`,
      strokeWidth: '0.5rem',
    },
  },
  customToolbar: {
    '& .MuiToolbar-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(0, 2, 0, 2),
      '& .MuiTextField-root': {
        width: '100%',
      },
    },
  },
  stateProductSelled: {
    color: theme.palette.success.main,
  },
  stateProductNotSell: {
    color: theme.palette.error.main,
  },
  customBodyTable: {
    '& .MuiTable-root': {
      minWidth: '1200px',
    },
  },
  formControl: {
    width: '100%',
  },
  typoPromo: {
    color: '#1C523C',
    fontWeight: 'bold',
  },
  typoConnected: {
    color: '#2DCF58',
    fontWeight: 'bold',
  },
  typoVip: {
    color: '#f20d0d',
    fontWeight: 'bold',
  },
  tdBorderRight: {
    borderRight: '1px solid #e0e0e0',
  },
  tableCustom: {
    overflowX: 'initial',
  },
  groupAction: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
}));
export default function CopyFlowDiagramView(props) {
  const classes = useStyles();
  const { openDetail, connectedSiteList } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [diagramData, setDiagramData] = useState(null);
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 400 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -(nodeSize.x / 2),
    y: -(nodeSize.y / 2) + 50,
  };

  const convertToDiagram = () => {
    const newArray = cloneDeep(connectedSiteList);
    axiosService.get('/my-site').then((res) => {
      const data = res?.data?.site;
      const rootSite = {
        id: data._id,
        isRoot: true,
        logo: data.avatar || defaultImg,
        name: data.name || '',
        connectedDate: data?.connected_at ? moment(data?.connected_at).format('DD/MM/YYYY') : '',
        origin: 'Không rõ',
        totalCopiedProducts: 0,
        isBrowsed: true,
        children: createDiagramData(newArray),
      };

      setDiagramData(rootSite);
    });
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      <rect width='10' height='10' x='-10' onClick={toggleNode} />
      <foreignObject {...foreignObjectProps}>
        <TreeNode
          nodeDatum={nodeDatum}
          toggleNode={toggleNode}
          openDetail={openDetail}
        />
      </foreignObject>
    </g>
  );

  useEffect(() => {
    if (connectedSiteList && connectedSiteList.length > 0) {
      setDiagramData(null);
      convertToDiagram();
    }
  }, [connectedSiteList]);

  return (
    <Box className={classes.containerStyles} ref={containerRef}>
      {diagramData && (
        <Tree
          data={diagramData}
          nodeSize={nodeSize}
          pathFunc='step'
          zoom={0.7}
          pathClassFunc={() => 'node_link'}
          translate={{ x: 530, y: 130 }}
          scaleExtent={{ max: 4, min: -1 }}
          enableLegacyTransitions
          separation={{ nonSiblings: 2, siblings: 4 }}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
          orientation='vertical'
        />
      )}
    </Box>
  );
}
