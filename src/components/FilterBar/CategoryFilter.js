/* eslint-disable react-hooks/rules-of-hooks */
import { makeStyles, styled, Typography } from '@material-ui/core';
import { WbSunny } from '@material-ui/icons';
import { TreeItem, TreeView } from '@material-ui/lab';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const StyledItem = styled(TreeItem)({
    marginBottom: 10,
    '& .MuiTreeItem-iconContainer ': {
        display: 'none'
    },
    '& .MuiTypography-body1"': {
        fontSize: '12px !important'
    },
    '& li:before': {
        content: "• "
    }
})

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        marginTop: 10,
        color: theme.palette.text.secondary,
        "&:hover > $content": {
            backgroundColor: theme.palette.action.hover
        },
        "&:focus > $content, &$selected > $content": {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: "var(--tree-view-color)"
        },
        "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
            backgroundColor: "transparent"
        }
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        "$expanded > &": {
            fontWeight: theme.typography.fontWeightRegular
        }
    },
    group: {
        marginLeft: 0,
        "& $content": {
            paddingLeft: theme.spacing(2)
        }
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: "inherit",
        color: "inherit"
    },
    labelRoot: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0.5, 0)
    },
    labelIcon: {
        marginRight: theme.spacing(1)
    },
    labelText: {
    }
}));

export default function CommonCategory(props) {
    const { categorys, onSubCategorySelect } = props
    const [firstCate, setfirstCate] = useState('');
    const classes = useTreeItemStyles();

    const SubcateGory = (props) => {
        const classes = useTreeItemStyles();
        const {
            labelText,
            labelIcon: LabelIcon,
            labelInfo,
            color,
            bgColor,
            ...other
        } = props;

        return (
            <TreeItem
                label={
                    <Typography variant="body2">
                        {labelText}
                    </Typography>
                }
                style={{
                    "--tree-view-color": color,
                    "--tree-view-bg-color": bgColor
                }}
                classes={{
                    root: classes.root,
                    content: classes.content,
                    expanded: classes.expanded,
                    selected: classes.selected,
                    group: classes.group,
                    label: classes.label
                }}
                {...other}
            />
        );
    }

    useEffect(() => {
        if (categorys[0]) {
            setfirstCate(categorys[0]._id)
        }
    }, [categorys]);

    return (
        <TreeView>
            {
                categorys.map((cate, key) => {
                    return (
                        <StyledItem key={key} nodeId={cate.id} label={
                            <Typography variant="body2">
                                {cate.name}
                            </Typography>
                        }>
                            {
                                cate.sub_category.map((sub, key) => {
                                    return (
                                        <SubcateGory
                                            key={key}
                                            nodeId={sub._id}
                                            labelText={sub.name}
                                            color="primary"
                                            bgColor="#e6f4ea"
                                            onClick={() => {
                                                onSubCategorySelect(sub._id)
                                            }}
                                        />
                                    )
                                })
                            }
                        </StyledItem>
                    )
                })
            }
        </TreeView>
    );
}

CommonCategory.propTypes = {
    categorys: PropTypes.array,
    onSubCategorySelect: PropTypes.func,
};
CommonCategory.defaultProps = {
    categorys: [],
    onSubCategorySelect: noop
};
