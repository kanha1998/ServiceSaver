@Component
public class KafkaAvroProducer {

    private static final Logger LOG = LoggerFactory.getLogger(KafkaAvroProducer.class);

    private final KafkaTemplate<String, Accounts> template;

    @Value("${kafka.topic.name}")
    private String topicName;

    public KafkaAvroProducer(KafkaTemplate<String, Accounts> template) {
        this.template = template;
    }

    public Mono<Void> publishToKafka(Accounts accounts) {
        String messageId = UUID.randomUUID().toString();

        return Mono.fromFuture(() -> template.send(topicName, messageId, accounts).completable())
            .doOnSuccess(result -> LOG.info("Sent message [{}] with offset [{}]",
                accounts, result.getRecordMetadata().offset()))
            .doOnError(ex -> LOG.error("Unable to send message [{}] due to: {}", accounts, ex.getMessage()))
            .retryWhen(Retry.backoff(3, Duration.ofMillis(500))
                .maxBackoff(Duration.ofSeconds(5)) // Maximum backoff duration
                .doBeforeRetry(signal -> LOG.warn("Retrying to send message [{}] due to error: {}",
                    accounts, signal.failure())))
            .onErrorResume(ex -> {
                LOG.error("Retries exhausted for message [{}]. Error: {}", accounts, ex.getMessage());
                return Mono.empty(); // Handle failure case gracefully
            });
    }
}
