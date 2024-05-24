import React from 'react';
import _ from 'lodash';
import { Alert } from 'rsuite';
import status from '@/constants/responseStatus';
import { setPageError } from '@/utils';
import FormattedMessage from '@/components/FormattedMessageWithProvider';
import { FETCH_METHOD } from '@/utils/request/fetch';

interface Data {
  status?: status;
  message?: string;
  url?: string;
}

export interface CheckDataStatusOptions {
  method?: string;
  disabledNotification?: boolean;
}

// 监测API 返回数据的状态
export default function checkDataStatus(
  data: Data,
  options: CheckDataStatusOptions = {
    method: 'get',
    disabledNotification: false,
  }
) {
  switch (data.status) {
    case status.SUCCESS: {
      //  如果某个 Action 不需要消息提醒，设置 options.disabledNotification=true 就可以了;
      if (
        _.includes(
          [FETCH_METHOD.POST, FETCH_METHOD.PUT, FETCH_METHOD.PATCH, FETCH_METHOD.DELETE],
          _.toUpper(options.method)
        ) &&
        !options.disabledNotification
      ) {
        Alert.success(<FormattedMessage id="commons.message.OperationSuccessful" />);
      }
      return true;
    }
    case status.INVALID: {
      Alert.error(
        <FormattedMessage
          id="commons.message.OperationFailure"
          values={{
            message: data.message ? `：${data.message}` : '：未知错误',
          }}
        />
      );
      return false;
    }
    case status.NOT_LOGGED_IN:
    case status.REDIRECT: {
      window.location.replace(data.url);
      return false;
    }
    case status.EXCEPTION:
      Alert.error(<FormattedMessage id="commons.message.APIException" />);
      return false;
    case status.NOT_FOUND:
      setPageError('404');
      return false;
    case status.NO_ACCESS:
      setPageError('403');
      return false;
    default:
      return true;
  }
}
