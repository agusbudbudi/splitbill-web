"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WalletButtons from "@/components/payment/WalletButtons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatToIDR, cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface PaymentDetails {
  name: string;
  phone: string;
  amount: number;
  status: string;
  expiresAt: string;
}

export default function PaymentDetailPage() {
  const { paymentId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/${paymentId}`);
        const result = await response.json();

        if (result.success) {
          setPayment(result.data);
        } else {
          setError(result.error || "Gagal memuat detail pembayaran");
          if (result.data) {
             setPayment(result.data);
          }
        }
      } catch (err) {
        setError("Terjadi kesalahan yang tidak terduga");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  useEffect(() => {
    if (!payment?.expiresAt) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(payment.expiresAt) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft("00:00");
        setError("Link Pembayaran telah kadaluwarsa");
        return;
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [payment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium animate-pulse">Memuat pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative">
      {/* Blue background behind header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-primary h-[150px] z-0 rounded-b-[20px]" />

      <div className="w-full max-w-[600px] min-h-screen flex flex-col relative z-10">
        <Header 
          title="Payment Request" 
          showBackButton 
          onBack={() => router.push("/")} 
        />

        <main className="flex-1 p-4 pb-12 space-y-6">
          {error && (!payment || payment.status === "expired" || timeLeft === "00:00") ? (
            <Card className="w-full border-none rounded-xl overflow-hidden mt-4">
              <CardHeader className="text-center pt-8">
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">Link Kadaluwarsa</CardTitle>
                <CardDescription className="text-slate-500 max-w-[250px] mx-auto pt-2">
                  {error || "Permintaan pembayaran ini sudah tidak valid atau sudah berakhir."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8 px-8 flex flex-col items-center">
                <Button 
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full h-14 text-sm font-bold transition-all rounded-md"
                >
                  Kembali ke Beranda
                </Button>
              </CardContent>
            </Card>
          ) : payment ? (
            <Card className="border-none rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl mt-4">
              <CardHeader className="text-center pt-8 pb-4">
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Permintaan untuk</CardDescription>
                <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">{payment.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 px-6 pb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Pembayaran</div>
                  <div className="text-4xl font-black text-primary tracking-tighter">
                    {formatToIDR(payment.amount).replace(/,00$/, "")}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-orange-600 bg-orange-50 py-1 px-3 rounded-full w-fit mx-auto border border-orange-100 min-w-[140px]">
                    <Clock className="w-3 h-3" />
                    <span>BERAKHIR DALAM {timeLeft}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pilih Metode Pembayaran</span>
                    <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                  </div>
                  
                  <WalletButtons phone={payment.phone} amount={payment.amount} />
                </div>
                
                <div className="pt-2 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 py-1.5 px-4 rounded-full border border-slate-100">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    PEMBAYARAN TERVERIFIKASI & AMAN
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed max-w-[280px]">
                    Silakan ikuti instruksi pada aplikasi e-wallet masing-masing setelah tombol diklik.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  );
}
