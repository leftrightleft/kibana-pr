/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo } from 'react';

import { i18n } from '@kbn/i18n';
import type { SignificantTerm } from '@kbn/ml-agg-utils';

import { SEARCH_QUERY_LANGUAGE } from '../../application/utils/search_utils';
import { useAiopsAppContext } from '../../hooks/use_aiops_app_context';

import { TableActionButton } from './table_action_button';
import { getTableItemAsKQL } from './get_table_item_as_kql';
import type { GroupTableItem, TableItemAction } from './types';

const viewInDiscoverMessage = i18n.translate(
  'xpack.aiops.logRateAnalysis.resultsTable.linksMenu.viewInDiscover',
  {
    defaultMessage: 'View in Discover',
  }
);

export const useViewInDiscoverAction = (dataViewId?: string): TableItemAction => {
  const { application, share, data } = useAiopsAppContext();

  const discoverLocator = useMemo(
    () => share.url.locators.get('DISCOVER_APP_LOCATOR'),
    [share.url.locators]
  );

  const discoverUrlError = useMemo(() => {
    if (!application.capabilities.discover?.show) {
      const discoverNotEnabled = i18n.translate(
        'xpack.aiops.logRateAnalysis.resultsTable.discoverNotEnabledErrorMessage',
        {
          defaultMessage: 'Discover is not enabled',
        }
      );

      return discoverNotEnabled;
    }
    if (!discoverLocator) {
      const discoverLocatorMissing = i18n.translate(
        'xpack.aiops.logRateAnalysis.resultsTable.discoverLocatorMissingErrorMessage',
        {
          defaultMessage: 'No locator for Discover detected',
        }
      );

      return discoverLocatorMissing;
    }
    if (!dataViewId) {
      const autoGeneratedDiscoverLinkError = i18n.translate(
        'xpack.aiops.logRateAnalysis.resultsTable.autoGeneratedDiscoverLinkErrorMessage',
        {
          defaultMessage: 'Unable to link to Discover; no data view exists for this index',
        }
      );

      return autoGeneratedDiscoverLinkError;
    }
  }, [application.capabilities.discover?.show, dataViewId, discoverLocator]);

  const generateDiscoverUrl = async (groupTableItem: GroupTableItem | SignificantTerm) => {
    if (discoverLocator !== undefined) {
      const url = await discoverLocator.getRedirectUrl({
        indexPatternId: dataViewId,
        timeRange: data.query.timefilter.timefilter.getTime(),
        filters: data.query.filterManager.getFilters(),
        query: {
          language: SEARCH_QUERY_LANGUAGE.KUERY,
          query: getTableItemAsKQL(groupTableItem),
        },
      });

      return url;
    }
  };

  return {
    render: (tableItem: SignificantTerm | GroupTableItem) => {
      const tooltipText = discoverUrlError ? discoverUrlError : viewInDiscoverMessage;

      const clickHandler = async () => {
        const openInDiscoverUrl = await generateDiscoverUrl(tableItem);
        if (typeof openInDiscoverUrl === 'string') {
          await application.navigateToUrl(openInDiscoverUrl);
        }
      };

      return (
        <TableActionButton
          dataTestSubjPostfix="Discover"
          iconType="discoverApp"
          isDisabled={discoverUrlError !== undefined}
          label={viewInDiscoverMessage}
          tooltipText={tooltipText}
          onClick={clickHandler}
        />
      );
    },
  };
};
