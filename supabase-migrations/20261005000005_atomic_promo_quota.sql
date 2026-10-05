-- =====================================================================
-- 20261005000005_atomic_promo_quota.sql
-- Fungsi atomic untuk klaim kuota promo produk dengan penanganan race condition
-- =====================================================================

CREATE OR REPLACE FUNCTION public.claim_product_promo_quota(
  p_product_id UUID,
  p_qty INT DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_remaining INT;
  v_updated INT;
BEGIN
  IF p_qty <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Jumlah kuota tidak valid');
  END IF;

  -- Atomic update untuk mitigasi race condition pada level database
  UPDATE public.products
  SET promo_quota_remaining = promo_quota_remaining - p_qty
  WHERE id = p_product_id
    AND promo_quota_remaining >= p_qty
  RETURNING promo_quota_remaining INTO v_remaining;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    -- Cek sisa kuota saat ini untuk diagnosis
    SELECT promo_quota_remaining INTO v_remaining
    FROM public.products
    WHERE id = p_product_id;

    IF v_remaining IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Produk tidak ditemukan');
    ELSIF v_remaining < p_qty THEN
      RETURN jsonb_build_object('success', false, 'error', 'Kuota promo untuk produk ini sudah habis.', 'remaining', v_remaining);
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Gagal memproses kuota karena persaingan transaksi (race condition). Silakan coba lagi.');
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'remaining', v_remaining);
END;
$$;

-- Hak akses eksekusi RPC untuk anon & authenticated
REVOKE ALL ON FUNCTION public.claim_product_promo_quota(UUID, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_product_promo_quota(UUID, INT) TO anon, authenticated;
