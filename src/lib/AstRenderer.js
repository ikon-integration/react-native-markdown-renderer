import React, { Component, PropTypes } from "react";
import { Text, View } from "react-native";
import getUniqueID from "./util/getUniqueID";

export function rootRenderRule(children, styles) {
  return <View key={getUniqueID()} style={styles.root}>{children}</View>;
}

/**
 *
 */
export default class AstRenderer {
  /**
   *
   * @param {Object.<string, function>} renderRules
   * @param {any} style
   */
  constructor(renderRules, style) {
    this._renderRules = renderRules;
    this._style = style;
  }

  /**
   *
   * @param {string} type
   * @return {string}
   */
  getRenderFunction = type => {
    const renderFunction = {
      ...this._style[type],
      ...this._renderRules[type]
    };

    if (!renderFunction) {
      throw new Error(
        `${type} renderRule not defined example: <Markdown rules={renderRules}>`
      );
    }
    return renderFunction;
  };

  /**
   *
   * @param node
   * @param parentNodes
   * @return {*}
   */
  renderNode = (node, parentNodes, optionalIndex) => {
    const renderFunction = this.getRenderFunction(node.type);

    const parents = [...parentNodes];
    parents.unshift(node);

    if (node.type === "text") {
      return renderFunction(node, [], parentNodes, this._style, optionalIndex);
    }

    const children = node.children.map((value, index) => {
      return this.renderNode(value, parents, index);
    });

    return renderFunction(node, children, parentNodes, this._style, optionalIndex);
  };

  /**
   *
   * @param nodes
   * @return {*}
   */
  render = nodes => {
    const children = nodes.map(value => this.renderNode(value, []));
    return rootRenderRule(children, this._style);
  };
}
