/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React from 'react';
import type { ComponentType } from 'react';
import { of } from 'rxjs';

import { TagSelector, TagList } from '../mocks';
import { ContentEditorProvider } from '../services';
import type { Services } from '../services';

const theme$ = of({ darkMode: false });

export const getMockServices = (overrides?: Partial<Services>) => {
  const services = {
    openFlyout: jest.fn(() => ({
      onClose: Promise.resolve(),
      close: () => Promise.resolve(),
    })),
    TagList,
    TagSelector,
    notifyError: () => undefined,
    theme$,
    ...overrides,
  };

  return services;
};

export function WithServices<P>(Comp: ComponentType<P>, overrides: Partial<Services> = {}) {
  return (props: P) => {
    const services = getMockServices(overrides);
    return (
      <ContentEditorProvider {...services}>
        <Comp {...props} />
      </ContentEditorProvider>
    );
  };
}
