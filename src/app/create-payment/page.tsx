"use client";

import { useState } from "react";
import PaymentForm from "@/components/payment/PaymentForm";
import QRCodeDisplay from "@/components/payment/QRCodeDisplay";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function CreatePaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    paymentUrl: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Blue background behind header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-primary h-[150px] z-0 rounded-b-[20px]" />

      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative z-10">
        <Header 
          title="Buat Tagihan" 
          showBackButton 
          onBack={() => router.push("/")} 
        />

        <main className="flex-1 p-4 pb-12 space-y-6">
          {!paymentData ? (
            <PaymentForm onSuccess={setPaymentData} />
          ) : (
            <Card className="border-none rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl mt-4">
             <CardContent className="p-6 pt-8 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">QR Berhasil Dibuat!</h2>
                  <p className="text-sm text-slate-500 font-medium">Scan QR di bawah untuk melakukan pembayaran</p>
                </div>

                <div className="flex justify-center">
                  <QRCodeDisplay paymentUrl={paymentData.paymentUrl} />
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-md border-dashed border-2 hover:bg-slate-50 transition-all font-bold"
                    onClick={() => setPaymentData(null)}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Buat Tagihan Baru
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full h-14 rounded-md font-bold transition-all"
                    onClick={() => router.push("/")}
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
