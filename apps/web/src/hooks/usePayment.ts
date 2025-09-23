// Packages
import { useEffect, useState } from 'preact/hooks';
import { loadTossPayments, ANONYMOUS, } from '@tosspayments/tosspayments-sdk';
import {toast} from "@libs/toast.ts";

interface UsePaymentProps {
  accessToken: string;
  price: number;
}

const { PUBLIC_API_URL } = import.meta.env;

export default function usePayment({ accessToken, price, }: UsePaymentProps) {
  const [widget, setWidget] = useState<any>();

  useEffect(() => {
    const init = async () => {
      try {
        const keyData = await fetch(`${PUBLIC_API_URL}/v1/payment/provider/key`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`API Error: ${res.status}`);
            }

            return res.json();
          });

        const {
          apiKey,
          code,
        } = keyData;

        const sdk = await loadTossPayments(apiKey);
        const widgets = sdk.widgets({ customerKey: ANONYMOUS });

        // 초기 금액 설정
        await widgets.setAmount({ value: price, currency: 'KRW' });

        // 결제수단 UI 렌더링
        widgets.renderPaymentMethods({
          selector: '#tosspayments-payment-methods',
          variantKey: code,
        });

        // 약관 UI 렌더링
        widgets.renderAgreement({
          selector: '#tosspayments-agreement',
          variantKey: code,
        });

        setWidget(widgets);
      } catch (err) {
        console.error(err);
        toast.show({ type: 'error', message: err });
      }
    };

    init();
  }, [price, accessToken]);

  const requestPayment = async (props: {
    orderId: string;
    orderName: string;
    customerName: string;
    customerEmail?: string;
    customerMobilePhone?: string;
  }) => {
    const {
      orderId,
      orderName,
      customerName,
      customerEmail,
      customerMobilePhone,
    } = props;

    if (!widget) {
      toast.show({ type: 'error', message: '결제 모듈이 초기화되지 않았습니다.' });
      return;
    }

    try {
      await widget.requestPayment({
        orderId,
        orderName,
        customerName,
        customerEmail,
        customerMobilePhone,
        successUrl: `${window.location.origin}/contract/success`,
        failUrl: `${window.location.origin}/contract/failure`,
      });
    } catch (err: any) {
      console.log(err);
      toast.show({ type: 'error', message: '결제 요청 중 오류가 발생했습니다.' });
    }
  };

  return { requestPayment };
}
