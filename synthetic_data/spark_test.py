


from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, max, round


class ChargePointsETLJob:
    input_path = 'electric-chargepoints-2017.csv'
    output_path = 'chargepoints-2017-analysis'

    def __init__(self):
        self.spark_session = (SparkSession.builder
                                          .master("local[*]")
                                          .appName("ElectricChargePointsETLJob")
                                          .getOrCreate())

    def extract(self):
        return self.spark_session.read.csv(self.input_path, header=True, inferSchema=True)

    def transform(self, df):
        # Rename columns for clarity
        df = df.withColumnRenamed("CPID", "chargepoint_id") \
            .withColumnRenamed("PluginDuration", "plugin_duration") \
            .withColumnRenamed("ConnectorType", "connector_type")

        # Filter out rows with null values in plugin_duration and chargepoint_id
        df = df.filter(df["plugin_duration"].isNotNull())
        df = df.filter(df["chargepoint_id"].isNotNull())

        # Group by chargepoint_id and calculate average and maximum plugin_duration
        agg_df = df.groupBy("chargepoint_id").agg(
            avg("plugin_duration").alias("avg_duration"),
            max("plugin_duration").alias("max_duration")
        )

        # Format avg_duration and max_duration to 2 decimal places
        agg_df = agg_df.withColumn("avg_duration", round(col("avg_duration"), 2)) \
                    .withColumn("max_duration", round(col("max_duration"), 2))

        agg_df.show()
        return agg_df

    def load(self, df):
        df.write.mode("overwrite").parquet(self.output_path)

    def run(self):
        self.load(self.transform(self.extract()))


if __name__ == "__main__":
    job = ChargePointsETLJob()
    job.run()

