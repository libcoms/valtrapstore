export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Политика конфиденциальности</h1>

      <div className="prose prose-stone max-w-none space-y-6 text-stone-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">1. Сбор информации</h2>
          <p>
            Мы собираем информацию, которую вы предоставляете при оформлении заказа: имя, номер телефона и адрес доставки. Эта информация используется исключительно для обработки вашего заказа и связи с вами.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">2. Использование информации</h2>
          <p>
            Ваши персональные данные используются для обработки заказов и связи по вопросам заказа. Мы не передаём ваши данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">3. Хранение данных</h2>
          <p>
            Данные хранятся на защищённых серверах и доступны только уполномоченным сотрудникам магазина.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">4. Ваши права</h2>
          <p>
            Вы имеете право запросить удаление ваших персональных данных, связавшись с нами через форму обратной связи.
          </p>
        </section>
      </div>
    </div>
  );
}
