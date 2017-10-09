import {
  Parent,
  Node,
  Text,
} from 'typed-unist'

/**
 * Root (`Parent`) houses all nodes.
 */
export interface Root extends Parent {
  type: 'root'
}

/**
 * **Element** (**Parent**) represents an HTML Element.  For example, a `div`.
 * HAST Elements corresponds to the HTML Element interface.
 *
 * One element is special, and comes with another property: `<template>` with
 * `content`.  The contents of a template element is not exposed through its
 * `children`, like other elements, but instead on a `content` property which
 * houses a `Root` node.
 */
export interface Element extends Parent {
  type: 'element'
  tagName: string
  properties: {
    [key: string]: any
  }
  content?: Root
}

/**
 * **Doctype** (**Node**) defines the type of the document.
 */
export interface Doctype extends Node {
  type: 'doctype'
  name: string
  public?: string
  system?: string
}

/**
 * **Comment** (**Text**) represents embedded information.
 */
export interface Comment extends Text {
  type: 'comment'
}

/**
 * `TextNode` (`Text`) represents everything that is just text. Note that its
 * `type` property is `text`, but it is different from `Text`.
 */
export interface TextNode extends Text {
  type: 'text'
}
